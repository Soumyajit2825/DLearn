#![cfg(test)]

use soroban_sdk::{Env, String, Address, Symbol, symbol_short, vec};
use crate::{CertificateContract, CertificateContractClient, DataKey, Certificate};

fn setup_test() -> (Env, CertificateContractClient<'static>) {
    let env = Env::default();
    let contract_id = env.register_contract(None, CertificateContract);
    let client = CertificateContractClient::new(&env, &contract_id);
    let admin = env.current_contract_address();

    client.init(&admin);
    (env, client)
}

#[test]
fn test_init() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CertificateContract);
    let client = CertificateContractClient::new(&env, &contract_id);
    let admin = env.current_contract_address();

    client.init(&admin);

    let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
    assert_eq!(stored_admin, admin);
}

#[test]
fn test_issue_certificate() {
    let (env, client) = setup_test();
    let admin = env.current_contract_address();
    let student = Address::generate(&env);

    let cert_id = client.issue(
        &admin,
        &student,
        &1u32,
        &String::from_str(&env, "Blockchain Fundamentals"),
        &String::from_str(&env, "A"),
        &String::from_str(&env, "0xabc123"),
    );

    let cert_id_str = Symbol::new(&env, "cert_1");
    assert_eq!(cert_id, cert_id_str);

    let certificate = client.verify(&cert_id);
    assert!(certificate.is_some());
    let cert = certificate.unwrap();
    assert_eq!(cert.student, student);
    assert_eq!(cert.course_id, 1u32);
    assert_eq!(cert.course_name, String::from_str(&env, "Blockchain Fundamentals"));
    assert_eq!(cert.grade, String::from_str(&env, "A"));
    assert_eq!(cert.hash, String::from_str(&env, "0xabc123"));
    assert!(!cert.revoked);
}

#[test]
fn test_issue_unique_ids() {
    let (env, client) = setup_test();
    let admin = env.current_contract_address();
    let student1 = Address::generate(&env);
    let student2 = Address::generate(&env);

    let cert1 = client.issue(
        &admin,
        &student1,
        &1u32,
        &String::from_str(&env, "Course 1"),
        &String::from_str(&env, "A"),
        &String::from_str(&env, "hash1"),
    );

    let cert2 = client.issue(
        &admin,
        &student2,
        &2u32,
        &String::from_str(&env, "Course 2"),
        &String::from_str(&env, "B"),
        &String::from_str(&env, "hash2"),
    );

    assert_ne!(cert1, cert2);
    assert_eq!(client.get_certificate_count(), 2u32);
}

#[test]
fn test_revoke_certificate() {
    let (env, client) = setup_test();
    let admin = env.current_contract_address();
    let student = Address::generate(&env);

    let cert_id = client.issue(
        &admin,
        &student,
        &1u32,
        &String::from_str(&env, "Blockchain 101"),
        &String::from_str(&env, "A"),
        &String::from_str(&env, "0xhash"),
    );

    client.revoke(&admin, &cert_id);

    let cert = client.verify(&cert_id).unwrap();
    assert!(cert.revoked);
}

#[test]
fn test_get_student_certificates() {
    let (env, client) = setup_test();
    let admin = env.current_contract_address();
    let student = Address::generate(&env);

    client.issue(
        &admin,
        &student,
        &1u32,
        &String::from_str(&env, "Course 1"),
        &String::from_str(&env, "A"),
        &String::from_str(&env, "hash1"),
    );

    client.issue(
        &admin,
        &student,
        &2u32,
        &String::from_str(&env, "Course 2"),
        &String::from_str(&env, "B+"),
        &String::from_str(&env, "hash2"),
    );

    let certs = client.get_student_certificates(&student);
    assert_eq!(certs.len(), 2);

    let count = client.get_certificate_count();
    assert_eq!(count, 2u32);
}

#[test]
#[should_panic(expected = "HostError")]
fn test_issue_unauthorized() {
    let (env, client) = setup_test();
    let fake_admin = Address::generate(&env);
    let student = Address::generate(&env);

    client.issue(
        &fake_admin,
        &student,
        &1u32,
        &String::from_str(&env, "Course"),
        &String::from_str(&env, "A"),
        &String::from_str(&env, "hash"),
    );
}
