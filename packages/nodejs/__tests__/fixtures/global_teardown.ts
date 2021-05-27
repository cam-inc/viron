import './global_setup'; // for declare

export default async (): Promise<void> => {
  if (global.mongod) {
    await global.mongod.stop();
  }
};
