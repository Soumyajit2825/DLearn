#![cfg(test)]

use soroban_sdk::{Env, Address, Vec};
use crate::{EnrollmentContract, EnrollmentContractClient, DataKey, Enrollment};

fn setup_test() -> (Env, EnrollmentContractClient<'static>) {
    let env = Env::default();
    let contract_id = env.register_contract(None, EnrollmentContract);
    let client = EnrollmentContractClient::new(&env, &contract_id);
    let admin = env.current_contract_address();

    client.init(&admin);
    (env, client)
}

#[test]
fn test_init() {
    let env = Env::default();
    let contract_id = env.register_contract(None, EnrollmentContract);
    let client = EnrollmentContractClient::new(&env, &contract_id);
    let admin = env.current_contract_address();

    client.init(&admin);

    let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
    assert_eq!(stored_admin, admin);
}

#[test]
fn test_enroll() {
    let (env, client) = setup_test();
    let student = Address::generate(&env);

    client.enroll(&student, &1u32);

    let enrollment = client.get_enrollment(&student);
    assert!(enrollment.is_some());
    let e = enrollment.unwrap();
    assert_eq!(e.student, student);
    assert_eq!(e.course_id, 1u32);
    assert_eq!(e.progress, 0u32);
    assert!(!e.completed);
    assert_eq!(e.certificate_id, None);
}

#[test]
#[should_panic(expected = "Already enrolled")]
fn test_enroll_duplicate() {
    let (env, client) = setup_test();
    let student = Address::generate(&env);

    client.enroll(&student, &1u32);
    client.enroll(&student, &1u32);
}

#[test]
fn test_multiple_students_same_course() {
    let (env, client) = setup_test();
    let student1 = Address::generate(&env);
    let student2 = Address::generate(&env);

    client.enroll(&student1, &1u32);
    client.enroll(&student2, &1u32);

    let enrollments = client.get_course_enrollments(&1u32);
    assert_eq!(enrollments.len(), 2);
}

#[test]
fn test_update_progress() {
    let (env, client) = setup_test();
    let student = Address::generate(&env);

    client.enroll(&student, &1u32);
    client.update_progress(&student, &50u32);

    let enrollment = client.get_enrollment(&student).unwrap();
    assert_eq!(enrollment.progress, 50u32);
}

#[test]
fn test_mark_completed() {
    let (env, client) = setup_test();
    let student = Address::generate(&env);

    client.enroll(&student, &1u32);

    let cert_id = soroban_sdk::symbol_short!("cert");
    client.mark_completed(&student, &cert_id);

    let enrollment = client.get_enrollment(&student).unwrap();
    assert!(enrollment.completed);
    assert_eq!(enrollment.progress, 100u32);
    assert_eq!(enrollment.certificate_id, Some(cert_id));
}

#[test]
fn test_enrollment_count() {
    let (env, client) = setup_test();
    let student1 = Address::generate(&env);
    let student2 = Address::generate(&env);
    let student3 = Address::generate(&env);

    client.enroll(&student1, &1u32);
    client.enroll(&student2, &2u32);
    client.enroll(&student3, &1u32);

    assert_eq!(client.get_enrollment_count(), 3u32);
}

#[test]
fn test_get_course_enrollments_filter() {
    let (env, client) = setup_test();
    let student1 = Address::generate(&env);
    let student2 = Address::generate(&env);
    let student3 = Address::generate(&env);

    client.enroll(&student1, &1u32);
    client.enroll(&student2, &1u32);
    client.enroll(&student3, &2u32);

    let course1_enrollments = client.get_course_enrollments(&1u32);
    assert_eq!(course1_enrollments.len(), 2);

    let course2_enrollments = client.get_course_enrollments(&2u32);
    assert_eq!(course2_enrollments.len(), 1);
}
