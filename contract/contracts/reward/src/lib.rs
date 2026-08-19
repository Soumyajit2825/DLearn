#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Reward(u32),
    StudentRewards(Address),
    RewardCount,
}

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub struct Reward {
    pub id: u32,
    pub student: Address,
    pub reward_type: Symbol,
    pub amount: i128,
    pub awarded_at: u64,
    pub claimed: bool,
}

#[contract]
pub struct RewardContract;

#[contractimpl]
impl RewardContract {
    pub fn init(env: Env, admin: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    pub fn award_reward(
        env: Env,
        admin: Address,
        student: Address,
        reward_type: Symbol,
        amount: i128,
    ) -> u32 {
        admin.require_auth();

        let count: u32 = env.storage().instance().get(&DataKey::RewardCount).unwrap_or(0);
        let reward_id = count + 1;

        let reward = Reward {
            id: reward_id,
            student: student.clone(),
            reward_type,
            amount,
            awarded_at: env.ledger().timestamp(),
            claimed: false,
        };

        env.storage().instance().set(&DataKey::Reward(reward_id), &reward);
        env.storage().instance().set(&DataKey::RewardCount, &reward_id);

        let mut student_rewards: Vec<Reward> = env.storage()
            .instance()
            .get(&DataKey::StudentRewards(student.clone()))
            .unwrap_or(Vec::new(&env));
        student_rewards.push_back(reward);
        env.storage().instance().set(&DataKey::StudentRewards(student), &student_rewards);

        reward_id
    }

    pub fn claim_reward(env: Env, student: Address, reward_id: u32) {
        student.require_auth();
        if let Some(mut reward) = env.storage().instance().get::<_, Reward>(&DataKey::Reward(reward_id)) {
            if reward.student == student && !reward.claimed {
                reward.claimed = true;
                env.storage().instance().set(&DataKey::Reward(reward_id), &reward);
            }
        }
    }

    pub fn get_reward(env: Env, reward_id: u32) -> Option<Reward> {
        env.storage().instance().get(&DataKey::Reward(reward_id))
    }

    pub fn get_student_rewards(env: Env, student: Address) -> Vec<Reward> {
        env.storage()
            .instance()
            .get(&DataKey::StudentRewards(student))
            .unwrap_or(Vec::new(&env))
    }

    pub fn get_reward_count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::RewardCount).unwrap_or(0)
    }
}
