export const URI_CONFIG = {
    AS_HOST_URI: 'localhost:5000',
    /* base api url */
    BASE_USER_API: '/api/user',
    BASE_CONTRACT_API: '/api/contract',
    BASE_CANDIDATE_API: 'api/candidate',
    BASE_CITIZEN_API: '/api/citizen',
    /* user url */
    GET_USER_HASH_URL: '/getUserHash',
    AUTH_URL: '/auth',
    /* candidate url */
    CANDIDATE_LIST_URL: '/list',
    GET_CANDIDATE_BY_ID_URL: '/getCandidateById',
    CREATE_CANDIDATE_URL: '/create',
    /* contract url */
    IS_ACCOUNT_UNLOCKED_URL: '/isAccountUnlocked',
    CREATE_CANDIDATE_LIST_URL: '/createCandidateList',
    VOTING_URL: '/voting',
    VOTING_LIST_URL: '/votingList',
    VOTE_RESULT_BY_ID_URL: '/voteResult/:id',
    VOTE_STATUS_URL: '/voteStatus',
    GET_BLOCK_URL: '/getBlock',
    /*citizen url*/
    CITIZEN_BY_ID: '',
    CITIZEN_GENERATE_PASSWORD: '/postGenerateNewPassword',
    CITIZEN_GENERATE_SYSTEM_ACCOUNT: '/generateUserAccount'
};
