function returnData(email) {

    const fakeData = {
        _id: {
            $oid: "5c15e9bd9b05b32b7dd022bd"
        },
        name: email,
        email: email,
        profile_photo: "https://someurltophoto.com/profile-photo.png"
    };

    return fakeData;
}

module.exports = returnData;