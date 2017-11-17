Meteor.startup(function () {
    if (Cpanel.Collection.Company.find().count() == 0) {
        Cpanel.Collection.Company.insert(
            {
                khName: 'ក្រុមហ៊ុន ជាភាសាខ្មែរ',
                khShortName: 'អក្សរកាត់',
                enName: 'Company Name',
                enShortName: 'short name',
                khAddress: 'អាស័យដ្ឋាន',
                enAddress: 'Address',
                telephone: '0123456789',
                email: 'eamil@gmail.com',
                website: 'http://www.website.com'
            }
        )
    }
});