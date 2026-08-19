#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Symbol};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Credential(Symbol),
    Verifier(Address),
    CredentialCount,
}

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub struct Credential {
    pub id: Symbol,
    pub subject: Address,
    pub issuer: Address,
    pub credential_type: String,
    pub issued_at: u64,
    pub expires_at: Option<u64>,
    pub metadata: String,
    pub revoked: bool,
}

#[contract]
pub struct VerificationContract;

#[contractimpl]
impl VerificationContract {
    pub fn init(env: Env, admin: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    fn generate_cred_id(env: &Env, count: u32) -> Symbol {
        match count {
            0 => Symbol::new(env, "cred_0"),
            1 => Symbol::new(env, "cred_1"),
            2 => Symbol::new(env, "cred_2"),
            3 => Symbol::new(env, "cred_3"),
            4 => Symbol::new(env, "cred_4"),
            5 => Symbol::new(env, "cred_5"),
            6 => Symbol::new(env, "cred_6"),
            7 => Symbol::new(env, "cred_7"),
            8 => Symbol::new(env, "cred_8"),
            9 => Symbol::new(env, "cred_9"),
            _ => Symbol::new(env, "cred_X"),
        }
    }

    pub fn issue_credential(
        env: Env,
        issuer: Address,
        subject: Address,
        credential_type: String,
        expires_at: Option<u64>,
        metadata: String,
    ) -> Symbol {
        issuer.require_auth();

        let count: u32 = env.storage().instance().get(&DataKey::CredentialCount).unwrap_or(0);
        let cred_id_num = count + 1;
        let cred_id = Self::generate_cred_id(&env, cred_id_num);

        let credential = Credential {
            id: cred_id.clone(),
            subject,
            issuer,
            credential_type,
            issued_at: env.ledger().timestamp(),
            expires_at,
            metadata,
            revoked: false,
        };

        env.storage().instance().set(&DataKey::Credential(cred_id.clone()), &credential);
        env.storage().instance().set(&DataKey::CredentialCount, &cred_id_num);

        cred_id
    }

    pub fn verify_credential(env: Env, credential_id: Symbol) -> Option<Credential> {
        env.storage().instance().get(&DataKey::Credential(credential_id))
    }

    pub fn verify_by_metadata(env: Env, metadata: String) -> Option<Credential> {
        let count: u32 = env.storage().instance().get(&DataKey::CredentialCount).unwrap_or(0);
        for i in 1..=count {
            let cred_id = Self::generate_cred_id(&env, i);
            if let Some(cred) = env.storage().instance().get::<_, Credential>(&DataKey::Credential(cred_id)) {
                if cred.metadata == metadata {
                    return Some(cred);
                }
            }
        }
        None
    }

    pub fn revoke_credential(env: Env, admin: Address, credential_id: Symbol) {
        admin.require_auth();
        if let Some(mut cred) = env.storage().instance().get::<_, Credential>(&DataKey::Credential(credential_id.clone())) {
            cred.revoked = true;
            env.storage().instance().set(&DataKey::Credential(credential_id), &cred);
        }
    }

    pub fn add_verifier(env: Env, admin: Address, verifier: Address) {
        admin.require_auth();
        env.storage().instance().set(&DataKey::Verifier(verifier), &true);
    }

    pub fn remove_verifier(env: Env, admin: Address, verifier: Address) {
        admin.require_auth();
        env.storage().instance().set(&DataKey::Verifier(verifier), &false);
    }

    pub fn is_verifier(env: Env, address: Address) -> bool {
        env.storage().instance().get(&DataKey::Verifier(address)).unwrap_or(false)
    }
}
