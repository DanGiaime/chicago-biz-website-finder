
// What fields you want in the final data from the chicago biz api
// field names MUST match API field names - https://dev.socrata.com/foundry/data.cityofchicago.org/uupf-x98q
// (scroll to fields, about half way down page)
const desiredFields = {
    legal_name: "",
    doing_business_as_name: "",
    zip_code: "",
    website: ""
};

// Type of business to search (consult business_acitivity in chicago data api)
// What is the _exact_ business type you want to search for? Must be a business type provided by api
const bizType = "Hair Services";

const fileName = "Hair Services";

module.exports = {
    bizType,
    desiredFields,
    fileName
};