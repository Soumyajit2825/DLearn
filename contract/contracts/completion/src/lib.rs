#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Map, Symbol, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Completion(Address, u32),
    CourseCompletions(u32),
    StudentCompletions(Address),
    CompletionCount,
}

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub struct Completion {
    pub student: Address,
    pub course_id: u32,
    pub score: u32,
    pub max_score: u32,
    pub passed: bool,
    pub completed_at: u64,
    pub quiz_results: Map<Symbol, u32>,
}

#[contract]
pub struct CompletionContract;

#[contractimpl]
impl CompletionContract {
    pub fn init(env: Env, admin: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    pub fn record_completion(
        env: Env,
        instructor: Address,
        student: Address,
        course_id: u32,
        score: u32,
        max_score: u32,
        passed: bool,
        quiz_results: Map<Symbol, u32>,
    ) {
        instructor.require_auth();

        let completion = Completion {
            student: student.clone(),
            course_id,
            score,
            max_score,
            passed,
            completed_at: env.ledger().timestamp(),
            quiz_results,
        };

        let key = DataKey::Completion(student.clone(), course_id);
        env.storage().instance().set(&key, &completion);

        let count: u32 = env.storage().instance().get(&DataKey::CompletionCount).unwrap_or(0);
        env.storage().instance().set(&DataKey::CompletionCount, &(count + 1));

        let mut course_completions: Vec<Completion> = env.storage()
            .instance()
            .get(&DataKey::CourseCompletions(course_id))
            .unwrap_or(Vec::new(&env));
        course_completions.push_back(completion.clone());
        env.storage().instance().set(&DataKey::CourseCompletions(course_id), &course_completions);

        let mut student_completions: Vec<Completion> = env.storage()
            .instance()
            .get(&DataKey::StudentCompletions(student.clone()))
            .unwrap_or(Vec::new(&env));
        student_completions.push_back(completion);
        env.storage().instance().set(&DataKey::StudentCompletions(student), &student_completions);
    }

    pub fn get_completion(env: Env, student: Address, course_id: u32) -> Option<Completion> {
        let key = DataKey::Completion(student, course_id);
        env.storage().instance().get(&key)
    }

    pub fn get_course_completions(env: Env, course_id: u32) -> Vec<Completion> {
        env.storage()
            .instance()
            .get(&DataKey::CourseCompletions(course_id))
            .unwrap_or(Vec::new(&env))
    }

    pub fn get_student_completions(env: Env, student: Address) -> Vec<Completion> {
        env.storage()
            .instance()
            .get(&DataKey::StudentCompletions(student))
            .unwrap_or(Vec::new(&env))
    }

    pub fn get_completion_count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::CompletionCount).unwrap_or(0)
    }
}
