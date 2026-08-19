#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, Vec};

#[cfg(test)]
mod test;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Enrolled(Address),
    CourseEnrollments(u32),
    EnrollmentCount,
}

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub struct Enrollment {
    pub student: Address,
    pub course_id: u32,
    pub enrolled_at: u64,
    pub progress: u32,
    pub completed: bool,
    pub certificate_id: Option<Symbol>,
}

#[contract]
pub struct EnrollmentContract;

#[contractimpl]
impl EnrollmentContract {
    pub fn init(env: Env, admin: Address) {
        let key = DataKey::Admin;
        env.storage().instance().set(&key, &admin);
    }

    pub fn enroll(env: Env, student: Address, course_id: u32) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let enrolled_key = DataKey::Enrolled(student.clone());
        if env.storage().instance().has(&enrolled_key) {
            panic!("Already enrolled in this course");
        }

        let enrollment = Enrollment {
            student: student.clone(),
            course_id,
            enrolled_at: env.ledger().timestamp(),
            progress: 0,
            completed: false,
            certificate_id: None,
        };
        env.storage().instance().set(&enrolled_key, &enrollment);

        let count: u32 = env.storage().instance().get(&DataKey::EnrollmentCount).unwrap_or(0);
        env.storage().instance().set(&DataKey::EnrollmentCount, &(count + 1));
        env.storage().instance().set(&DataKey::CourseEnrollments(count + 1), &enrollment);
    }

    pub fn get_enrollment(env: Env, student: Address) -> Option<Enrollment> {
        let key = DataKey::Enrolled(student);
        env.storage().instance().get(&key)
    }

    pub fn update_progress(env: Env, student: Address, progress: u32) {
        let key = DataKey::Enrolled(student.clone());
        if let Some(mut enrollment) = env.storage().instance().get::<_, Enrollment>(&key) {
            enrollment.progress = progress;
            env.storage().instance().set(&key, &enrollment);
        }
    }

    pub fn mark_completed(env: Env, student: Address, certificate_id: Symbol) {
        let key = DataKey::Enrolled(student.clone());
        if let Some(mut enrollment) = env.storage().instance().get::<_, Enrollment>(&key) {
            enrollment.completed = true;
            enrollment.progress = 100;
            enrollment.certificate_id = Some(certificate_id);
            env.storage().instance().set(&key, &enrollment);
        }
    }

    pub fn get_course_enrollments(env: Env, course_id: u32) -> Vec<Enrollment> {
        let count: u32 = env.storage().instance().get(&DataKey::EnrollmentCount).unwrap_or(0);
        let mut enrollments = Vec::new(&env);
        for i in 1..=count {
            if let Some(enrollment) = env.storage().instance().get::<_, Enrollment>(&DataKey::CourseEnrollments(i)) {
                if enrollment.course_id == course_id {
                    enrollments.push_back(enrollment);
                }
            }
        }
        enrollments
    }

    pub fn get_enrollment_count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::EnrollmentCount).unwrap_or(0)
    }
}
