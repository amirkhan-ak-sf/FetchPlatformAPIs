# FetchPlatformAPIs
This repository provides google sheets formulas which helps extract data from the anypoint platform APIs.
![image](https://user-images.githubusercontent.com/86777111/137478583-005570b6-ba0b-4e15-8295-74063f41e9e3.png)


# Purpose 
Allow Platform APIs consumption via google sheet formula. Anypoint Platform provides Platform APIs to fetch data from the platform. This is super useful to automate tasks and retrieve data using REST API. The purpose of this repository is to use JavaScript functions as formulas as part of the google sheets and automated the retrieval of Platform Data using the Platform APIs. 

Link to the Anypoint Platform APIs: https://anypoint.mulesoft.com/exchange/portals/anypoint-platform/

![image](https://user-images.githubusercontent.com/86777111/137478699-cb83e281-1db6-418b-a74e-1540995ca2e6.png)


# Implement Platform APIs custom function/formula in googlesheets.
In order to use the code.gs as a custom function / formula in google sheet, perform the following steps.

1. Open a new workbook in google sheets.
2. Goto Extensions > App Script.
![image](https://user-images.githubusercontent.com/86777111/137478961-26d87ff9-6ac0-4816-abb8-57094695ba3a.png)


3. Open the code.gs file on this repository and copy the script.
![image](https://user-images.githubusercontent.com/86777111/137478850-40e9eec3-2bec-41ad-9bd4-0aae1bdd002a.png)


4. Paste the code into the App script function code.gs file.
![image](https://user-images.githubusercontent.com/86777111/137479034-36d7f834-770d-4b06-a50e-35b224d53795.png)


5. That's it! The function is now available in google sheets.


# Setup google sheet
The recommended way to setup google sheet is to create multiple sheets which will be cross references in using the formulas / function to make the best possible automated workflow to extract data from Anypoint Platform. 

Here is the suggested sheets representation:
![image](https://user-images.githubusercontent.com/86777111/137480390-ef672202-2eeb-4c48-9694-31c02917f217.png)


# How-to-use the Platform API functions in google sheets
This repository provides 3 main function to be used to extract and retrieve data from the Anypoint Platform APIs into google sheets. 

## fetchToken 
The fetchToken formula is mainly used to fetch the token at the login for the authenticating user. 

The fetchToken function uses the following syntax:

    =fetchToken(url, username, password)

**url** represents the Anypoint Platform url e.g. "https://anypoint.mulesoft.com"
  
**username** represents the Anypoint authenticating user.

**password** represents the Anypoint authenticating user password. 

**returns** the value of the token into the cell.

### Build a Credentials Sheets
Recommended setup for googlesheet is to create a sheet with all credentials and use the formula in this sheet, which could be named as **Credentials** for instance. 

![image](https://user-images.githubusercontent.com/86777111/137480007-88250fe1-5c01-411e-80a7-5394c707ac13.png)

The picture above demonstrates the approach to use this formula. You have the URL at cell A2, the username at cell B2 and the password at cell C2. The token will be a result of the fetchToken formula at cell D2. 

In order to make the formula handling errors properly, we can make use of the iferror() function of google sheets to have a cleaner representation of the data. 

![image](https://user-images.githubusercontent.com/86777111/137480090-6b2b3ca8-3ea1-4b2e-8572-cade967abc5f.png)

## fetchJson
The fetchJson formula is used to retrieve the data using the platform APIs and the generated token from the fetchToken formula, which has been stored in the Credentialssheet in the cell D2. This will be important to use in all upcoming formulas.

The fetchJson function uses the following syntax:
    =fetchJson(url, token, xpath)
    
**url** represents the Anypoint Platform url of the resource which should be retrieved. This could be "https://anypoint.mulesoft.com/exchange/api/v2/assets" to retrieve all assets from Exchange or "https://anypoint.mulesoft.com/apiplatform/repository/v2/organizations/{organizationId}/users" to retrieve all users from the platform. The url already contains the initial url from fetchToken, so we can use a reference to the Credentials sheet parameter URL. 

**token** represents the authentication token, which has been received after user has been logged into the platform. Also here, we will refer to the token generated from fetchToken formula in the Credentials sheets cell D2. 

**xpath** represents the node which should be extracted into the cell where the formula is used. 

### Build a User Information Sheets
Lets create a sheet, where we extract the **User Information** from Anypoint platform and store the following data into the sheet:
- Id
- Firstname
- Lastname
- organizationId
- email
- phone

In order to retrieve the User Information, we need to access the platform API resource "https://anypoint.mulesoft.com/accounts/api/profile" and this will return the following data structure: 

    {
        "id": "e528c4d2-095a-4d3c-a405-1ccd4fea3fc5",
        "createdAt": "2021-08-30T15:45:41.899Z",
        "updatedAt": "2021-10-15T11:48:09.748Z",
        "organizationId": "674dba46-0d53-48d6-a390-86b1460bbd0a",
        "firstName": "Amir",
        "lastName": "Khan",
        "email": "amir.khan.xxxx.xxxx.xxxx@gmail.com",
        "phoneNumber": "0XX XXXXXXXX",
        "username": "amirkhan-xxxx-xxx-x",
        "idprovider_id": "mulesoft",
        "enabled": true,
        "deleted": false,
        "lastLogin": "2021-10-15T11:48:00.000Z",
        "mfaVerificationExcluded": false,
        "mfaVerifiersConfigured": "false",
        "isFederated": false,
        "type": "host",
        ...
        ...
        ...
    }
    
In order to retrieve data for "id", I need to use the fetchJson in the following format. 

    =fetchJSON(Credentials!A2 & "/accounts/api/profile", Credentials!D2, "id")

In this example the URL is retrieved from the Credentials sheets cell A2 and concatenated with "/account/api/profile" to set the right resource. The "id" is referred to be received from the node. 

For the remaining attributes, the following formula is used. 
- Firstname is retrieved with 

        =fetchJSON(Credentials!A2 & "/accounts/api/profile", Credentials!D2, "firstName")

- Lastname is retrieved with 

        =fetchJSON(Credentials!A2 & "/accounts/api/profile", Credentials!D2, "lastName")

- organizationId is retrieved with 

        =fetchJSON(Credentials!A2 & "/accounts/api/profile", Credentials!D2, "organizationId")
        
- email is retrieved with 

        =fetchJSON(Credentials!A2 & "/accounts/api/profile", Credentials!D2, "email")
        
- phone is retrieved with 

        =fetchJSON(Credentials!A2 & "/accounts/api/profile", Credentials!D2, "phoneNumber")


Also iferror() function will make sure, errors are handled properly. As a result the following sheet is automatically prepared:

![image](https://user-images.githubusercontent.com/86777111/137483072-47aeafdb-2002-403a-8023-8e8cba6169bd.png)

Important on this sheet is the organizatonId, which will be referenced in some of the subsequent requests in other sheets. 

### Build an Environments Sheets
Lets create a sheet, where we extract the **Environment** from Anypoint platform and store the following data into the sheet:
- Id
- Name
- organizationId
- Production
- Type
- Client-Id

In order to retrieve the User Information, we need to access the platform API resource "https://anypoint.mulesoft.com/apimanager/xapi/v1/organizations/{organizationId}/environments" and this will return the following data structure: 

      {
          "environments": [
              {
                  "id": "c3da379a-a6c0-47cc-84e2-809d2ef0b953",
                  "name": "Sandbox",
                  "organizationId": "674dba46-0d53-48d6-a390-86b1460bbd0a",
                  "isProduction": false,
                  "type": "sandbox",
                  "clientId": "8b41da5b7c5e46989e2d80aa1e593ad0"
              }
          ],
          "unclassified": false
      }
      

In order to retrieve data for "id", I need to use the fetchJson in the following format. Note that in the requesting URL we need to provide the organizationId which has been extracted in the **User Information** sheet before at cell B4, which we will be referring here. 

    =fetchJSON(Credentials!A2 & "/apimanager/xapi/v1/organizations/" & 'User Information'!B4 & "/environments", Credentials!D2, "environments/0/id")

In this example the URL is retrieved from the Credentials sheets cell A2 and concatenated with "/apimanager/xapi/v1/organizations/" & 'User Information'!B4 & "/environments" to set the right resource. As the id not is part of an environment array at a specific row, we need to refer it with "environment/0/id". This would be too static. In order to make it more dynamic, we will add a new column in the beginning which is called Index and will be concatenated into the xpath we want to extract from a resultset. 

This would change the fetchJSON to the following format:

    =fetchJSON(Credentials!A2 & "/apimanager/xapi/v1/organizations/" & 'User Information'!B4 & "/environments", Credentials!D2, "environments/" & A2 & "/id")
    
In Cell A2 in the Environment Sheet the new index is created. The same approach will now be used in all subsequent sheets for making our requests for dynamic. As Credentials and User Information data is always at the same place, we will put this as a static into our formula by using the $. This will help us to apply the formula to other rows in the same sheets. 

    =fetchJSON(Credentials!A$2 & "/apimanager/xapi/v1/organizations/" & 'User Information'!B$4 & "/environments", Credentials!D$2, "environments/" & A2 & "/id")

Also iferror() function will make sure, errors are handled properly. 

For the remaining attributes, the following formula is used. 
- Name is retrieved with 

        =iferror(fetchJSON(Credentials!A2 & "/apimanager/xapi/v1/organizations/" & 'User Information'!B4 & "/environments", Credentials!D2, "environments/" & A2 & "/name"), "")
        
- organizationId is retrieved with 

        =iferror(fetchJSON(Credentials!A2 & "/apimanager/xapi/v1/organizations/" & 'User Information'!B4 & "/environments", Credentials!D2,  "environments/" & A2 & "/organizationId"),"")
        
- Production is retrieved with 

        =iferror(fetchJSON(Credentials!A2 & "/apimanager/xapi/v1/organizations/" & 'User Information'!B4 & "/environments", Credentials!D2,  "environments/" & A2 & "/isProduction"),"")
      
- Type is retrieved with 

        =iferror(fetchJSON(Credentials!A2 & "/apimanager/xapi/v1/organizations/" & 'User Information'!B4 & "/environments", Credentials!D2,  "environments/" & A2 & "/type"),"")
        
- Client-Id is retrieved with 

        =iferror(fetchJSON(Credentials!A2 & "/apimanager/xapi/v1/organizations/" & 'User Information'!B4 & "/environments", Credentials!D2,  "environments/" & A2 & "/clientId"),"")
        

As a result the following sheet is automatically prepared:

![image](https://user-images.githubusercontent.com/86777111/137485556-31386ea5-a8a8-42e4-90b2-507928dd40c9.png)



