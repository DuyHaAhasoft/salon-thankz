import session from '../session'

const payload = {
    DEFAULT_PAGE_SIZE: 10,

    DEFAULT_COUNTRY: "VN",
    DEFAULT_SHOP_LOCATION: "vi-vn",

    DEFAULT_DATA_CLIENT: {
        sex: 3,
        email: null,
        notes: null,
        birthDD: "0",
        memberType: 1,
        address1: null,
        address2: null,
        birthYear: "0",
        clientName: "",
        postcode: null,
        birthMonth: "0",
        birthdayType: 1,
        country: "vi-vn",
        phoneNumber: null,
        shopLocation: "VN",
        memberNumber: null,
        mobileNumber: null,
        mobileNumber2: null,
        recommenderId: null,
        clientGroupId: null,
        clientRatingId: null,
        allowedMessageType: 1,
        clientGroupName: null,
        preferredStaffId: null,
        clientRatingName: null,
        preferredStaffName: null,
        clientReferralSourceId: null,
        clientReferralSourceName: null,
        shopId: session?.shopSession?.getShopId() ?? null,
        clientInputDateTimeTS: null, // Registered Date
        sessionToken: session.shopSession.getSessionToken(),
        // createdDateTimeTS: 1654527624, Time create client
    }
}

export default payload