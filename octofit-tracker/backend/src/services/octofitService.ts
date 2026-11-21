import mongoose from 'mongoose';
import { Activity, Team, User, Workout } from '../models/index.js';

function clientError(message: string) {
  return Object.assign(new Error(message), { status: 400 });
}

export async function listActivities() {
  return Activity.find().lean();
}

export async function createActivity(input: unknown) {
  if (!input || typeof input !== 'object') throw clientError('Invalid activity');

  const { userId, teamId, type, minutes } = input as {
    userId?: unknown;
    teamId?: unknown;
    type?: unknown;
    minutes?: unknown;
  };

  if (
    typeof userId !== 'string'
    || typeof teamId !== 'string'
    || typeof type !== 'string'
    || type.trim().length === 0
    || typeof minutes !== 'number'
    || !Number.isFinite(minutes)
    || minutes <= 0
  ) {
    throw clientError('Invalid activity');
  }

  if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(teamId)) {
    throw clientError('Invalid user or team ID');
  }

  const [user, team] = await Promise.all([
    User.findById(userId).lean(),
    Team.findById(teamId).lean(),
  ]);
  if (!user) throw clientError('User not found');
  if (!team) throw clientError('Team not found');

  return Activity.create({
    user: userId,
    team: teamId,
    type: type.trim(),
    minutes,
    points: minutes,
    occurredAt: new Date(),
  });
}

export async function listTeams() {
  return Team.find().lean();
}

export async function createTeam(input: unknown) {
  if (!input || typeof input !== 'object') throw clientError('Invalid team');

  const { name, mascot, members } = input as {
    name?: unknown;
    mascot?: unknown;
    members?: unknown;
  };

  if (typeof name !== 'string' || name.trim().length === 0) {
    throw clientError('Team name is required');
  }
  if (typeof mascot !== 'string' || mascot.trim().length === 0) {
    throw clientError('Team mascot is required');
  }

  const memberIds = members === undefined ? [] : members;
  if (!Array.isArray(memberIds) || memberIds.some((member) => typeof member !== 'string' || !mongoose.isValidObjectId(member))) {
    throw clientError('Invalid team member ID');
  }

  if (memberIds.length > 0) {
    const existingMembers = await User.find({
      _id: { $in: memberIds },
    }).distinct('_id');
    if (existingMembers.length !== memberIds.length) {
      throw clientError('Team member not found');
    }
  }

  return Team.create({
    name: name.trim(),
    mascot: mascot.trim(),
    members: memberIds,
  });
}

export async function getLeaderboard() {
  const totals = await Activity.aggregate([
    {
      $group: {
        _id: '$team',
        totalPoints: { $sum: '$points' },
      },
    },
  ]);

  const teamIds = totals.map((total) => total._id);
  const teams = await Team.find({ _id: { $in: teamIds } }).lean();
  const teamNames = new Map(
    teams.map((team) => [team._id.toString(), team.name]),
  );

  return totals
    .map((total) => ({
      teamName: teamNames.get(total._id.toString()) ?? '',
      totalPoints: total.totalPoints,
    }))
    .filter((entry) => entry.teamName.length > 0)
    .sort((left, right) => right.totalPoints - left.totalPoints)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}

export async function suggestWorkouts(userEmail: string) {
  const decodedEmail = decodeURIComponent(userEmail);
  const user = await User.findOne({ email: decodedEmail }).lean();
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

  const recentActivity = await Activity.findOne({ user: user._id })
    .sort({ occurredAt: -1 })
    .lean();

  let focus = user.fitnessGoal;
  if (recentActivity?.type) {
    const recentType = recentActivity.type.toLowerCase();
    if (recentType === 'run' || recentType === 'cycle') {
      focus = 'endurance';
    } else if (recentType === 'strength') {
      focus = 'strength';
    }
  }

  const workouts = await Workout.find({
    focus: { $regex: `^${focus}$`, $options: 'i' },
  }).lean();

  return workouts.map((workout) => ({
    ...workout,
    reason: `Recommended for ${user.fitnessGoal || 'your'} goal and recent ${recentActivity?.type || 'activity'} activity.`,
  }));
}

export { User };
