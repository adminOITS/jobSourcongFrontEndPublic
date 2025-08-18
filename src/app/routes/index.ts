export const ROUTES = {
  OFFER: {
    EDIT: 'offers/edit/:offerId',
    LIST: 'offers',
    DETAILS: 'offers/:offerId',
    VALIDATOR_VIEW: 'offers/validator/:validatorId',
    RECRUITER_VIEW: 'offers/recruiter/:recruiterId',
    ADD: 'companies/:companyId/offers/add',
    HR_ADD: 'offers/add',
  },
  RECRUITER: {
    BASE: 'recruiter',
    CREATE: 'recruiters/create',
    EDIT: 'recruiters/edit/:profileId',
    LIST: 'recruiters',
    UPDATE: 'recruiters/update/:recruiterId',
    DETAILS: 'recruiters/:recruiterId',
  },
  VALIDATOR: {
    BASE: 'validator',
    CREATE: 'validators/create',
    EDIT: 'validators/edit/:validatorId',
    LIST: 'validators',
    UPDATE: 'validators/update/:validatorId',
    DETAILS: 'validators/:validatorId',
  },
  PROFILES: {
    CREATE: 'profiles/create',
    EDIT: 'profiles/edit/:profileId',
    UPDATE: 'profiles/update/:profileId',
    LIST: 'profiles',
    DETAILS: 'profiles/:profileId',
  },
  CANDIDATE: {
    BASE: 'candidate',
    CREATE: 'candidates/create',
    EDIT: 'candidates/edit/:candidateId',
    LIST: 'candidates',
    DETAILS: 'candidates/:candidateId',
    PROFILES: 'candidates/profiles/:candidateId',
    AI_PROCESSING_HISTORY: 'candidates/ai-processing-history',
  },
  H_R: {
    BASE: 'hr',
    LIST: 'list',
  },
  H_R_ADMIN: {
    BASE: 'hr-admin',
    LIST: 'list',
  },
  GUEST: {
    BASE: 'guest',
  },
  HOME: 'home',
  DASHBOARD: 'dashboard',
  COMPANY: {
    CREATE: 'companies/create',
    EDIT: 'companies/edit/:companyId',
    LIST: 'companies',
    DETAILS: 'companies/:companyId',
  },
  MEMBERS: {
    LIST: 'members',
  },
  APPLICATION: {
    BASE: 'applications',
    LIST: 'applications/:offerId',
    TRACK_STATUS: 'applications/profile/:profileId',
    VALIDATION_REVIEW: 'applications/validation-review/:applicationId',
  },
  MAILING: {
    LIST: 'mailing',
    EDIT: 'mailing/:offerId/:profileId',
  },
  SETTINGS: {
    BASE: 'settings',
  },
  INTERVIEW: {
    LIST: 'interviews',
    ADD: 'interviews/add',
    EDIT: 'interviews/edit/:interviewId',
    DETAILS: 'interviews/:interviewId',
  },
};
