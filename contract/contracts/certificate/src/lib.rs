#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec, Symbol};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Certificate(Symbol),
    StudentCertificates(Address),
    CertificateCount,
}

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub struct Certificate {
    pub id: Symbol,
    pub student: Address,
    pub course_id: u32,
    pub course_name: String,
    pub issued_at: u64,
    pub grade: String,
    pub hash: String,
    pub revoked: bool,
}

#[contract]
pub struct CertificateContract;

#[contractimpl]
impl CertificateContract {
    pub fn init(env: Env, admin: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    fn generate_cert_id(env: &Env, count: u32) -> Symbol {
        // Use numeric symbol for simplicity
        match count {
            0 => Symbol::new(env, "cert_0"),
            1 => Symbol::new(env, "cert_1"),
            2 => Symbol::new(env, "cert_2"),
            3 => Symbol::new(env, "cert_3"),
            4 => Symbol::new(env, "cert_4"),
            5 => Symbol::new(env, "cert_5"),
            6 => Symbol::new(env, "cert_6"),
            7 => Symbol::new(env, "cert_7"),
            8 => Symbol::new(env, "cert_8"),
            9 => Symbol::new(env, "cert_9"),
            _ => Symbol::new(env, "cert_X"),
        }
    }

    pub fn issue(
        env: Env,
        admin: Address,
        student: Address,
        course_id: u32,
        course_name: String,
        grade: String,
        hash: String,
    ) -> Symbol {
        admin.require_auth();

        let count: u32 = env.storage().instance().get(&DataKey::CertificateCount).unwrap_or(0);
        let cert_id_num = count + 1;
        let cert_id = Self::generate_cert_id(&env, cert_id_num);

        let certificate = Certificate {
            id: cert_id.clone(),
            student: student.clone(),
            course_id,
            course_name,
            issued_at: env.ledger().timestamp(),
            grade,
            hash,
            revoked: false,
        };

        env.storage().instance().set(&DataKey::Certificate(cert_id.clone()), &certificate);
        env.storage().instance().set(&DataKey::CertificateCount, &cert_id_num);

        let mut student_certs: Vec<Symbol> = env.storage()
            .instance()
            .get(&DataKey::StudentCertificates(student.clone()))
            .unwrap_or(Vec::new(&env));
        student_certs.push_back(cert_id.clone());
        env.storage().instance().set(&DataKey::StudentCertificates(student), &student_certs);

        cert_id
    }

    pub fn verify(env: Env, certificate_id: Symbol) -> Option<Certificate> {
        env.storage().instance().get(&DataKey::Certificate(certificate_id))
    }

    pub fn revoke(env: Env, admin: Address, certificate_id: Symbol) {
        admin.require_auth();
        if let Some(mut cert) = env.storage().instance().get::<_, Certificate>(&DataKey::Certificate(certificate_id.clone())) {
            cert.revoked = true;
            env.storage().instance().set(&DataKey::Certificate(certificate_id), &cert);
        }
    }

    pub fn get_student_certificates(env: Env, student: Address) -> Vec<Certificate> {
        let cert_ids: Vec<Symbol> = env.storage()
            .instance()
            .get(&DataKey::StudentCertificates(student))
            .unwrap_or(Vec::new(&env));

        let mut certs = Vec::new(&env);
        for id in cert_ids.iter() {
            if let Some(cert) = env.storage().instance().get::<_, Certificate>(&DataKey::Certificate(id)) {
                certs.push_back(cert);
            }
        }
        certs
    }

    pub fn get_certificate_count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::CertificateCount).unwrap_or(0)
    }
}
