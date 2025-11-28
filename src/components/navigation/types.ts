export type RootTabParamList = {
  Home: undefined;
  Messages: undefined;
  Rankings: undefined;
  Stats: undefined;
  Profile: undefined;
};


export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  PasswordRecovery: undefined;
  MainTabs: undefined; 
};

export type RouteStackHomeParamList = {
  HomeMain: undefined;
  GoalDetails: { goalId: string };
  CreateGoal: undefined;
  EditGoal: { goalId: string };
}; 

export type RouteStackMessagesParamList = {
  MessagesMain: undefined;
  Chat: { chatId: string };
};

export type RouteStackProfileParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Settings: undefined;
};

export type RouteStackStatsParamList = {
  StatsMain: undefined;
  CreateGoal: undefined;
  StreakDetail: { streakId: string };
  CreateStreak: undefined;
};
