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

### Build a Credentials Sheet
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

### Build a User Information Sheet
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

### Build an Environments Sheet
Lets create a sheet, where we extract the **Environment** from Anypoint platform and store the following data into the sheet:
- Id
- Name
- organizationId
- Production
- Type
- Client-Id

In order to retrieve the Environments, we need to access the platform API resource "https://anypoint.mulesoft.com/apimanager/xapi/v1/organizations/{organizationId}/environments" and this will return the following data structure: 

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

        =iferror(fetchJSON(Credentials!A$2 & "/apimanager/xapi/v1/organizations/" & 'User Information'!B$4 & "/environments", Credentials!D$2, "environments/" & A2 & "/name"), "")
        
- organizationId is retrieved with 

        =iferror(fetchJSON(Credentials!A$2 & "/apimanager/xapi/v1/organizations/" & 'User Information'!B$4 & "/environments", Credentials!D$2,  "environments/" & A2 & "/organizationId"),"")
        
- Production is retrieved with 

        =iferror(fetchJSON(Credentials!A$2 & "/apimanager/xapi/v1/organizations/" & 'User Information'!B$4 & "/environments", Credentials!D$2,  "environments/" & A2 & "/isProduction"),"")
      
- Type is retrieved with 

        =iferror(fetchJSON(Credentials!A$2 & "/apimanager/xapi/v1/organizations/" & 'User Information'!B$4 & "/environments", Credentials!D$2,  "environments/" & A2 & "/type"),"")
        
- Client-Id is retrieved with 

        =iferror(fetchJSON(Credentials!A$2 & "/apimanager/xapi/v1/organizations/" & 'User Information'!B$4 & "/environments", Credentials!D$2,  "environments/" & A2 & "/clientId"),"")
        

As a result the following sheet is automatically prepared:

![image](https://user-images.githubusercontent.com/86777111/137485556-31386ea5-a8a8-42e4-90b2-507928dd40c9.png)


### Build an Design Center Projects Sheet
Lets create a sheet, where we extract the **Design Center Projects** from Anypoint platform and store the following data into the sheet:
- Id
- Name
- Type
- organizationId
- createdBy	
- createdDate	
- lastUpdatedDate

In order to retrieve the Design Center Projects, we need to access the platform API resource "https://anypoint.mulesoft.com/designcenter/api/v1/organizations/{{organization_id}}/projects" and this will return the following data structure: 

        [
            {
                "vcsStorageType": "GIT_INTERNAL",
                "externalUri": "/var/lib/anypoint-vcs-bare/projects/674dba46-0d53-48d6-a390-86b1460bbd0a/raml/AK-Omnichannel/8c5d7315-b691-4519-ac00-3616fd335184",
                "id": "8c5d7315-b691-4519-ac00-3616fd335184",
                "name": "AK-Omnichannel",
                "type": "raml",
                "environmentId": null,
                "organizationId": "674dba46-0d53-48d6-a390-86b1460bbd0a",
                "globalConfigurations": [],
                "flows": [],
                "dependencies": [],
                "enrichers": {},
                "catalogs": {},
                "topLevelElements": [],
                "metadata": null,
                "deleted": false,
                "revision": 0,
                "version": "1.0",
                "description": null,
                "createdBy": "amirkhan-ak-mulesoft",
                "createdDate": "2021-09-22T12:49:27",
                "lastUpdatedDate": "2021-09-22T12:50:27"
            },
            {
                "vcsStorageType": "GIT_INTERNAL",
                "externalUri": "/var/lib/anypoint-vcs-bare/projects/674dba46-0d53-48d6-a390-86b1460bbd0a/Mule_Application/Demo/09bc8273-7061-4bc4-8133-e8140146f8d8",
                "id": "09bc8273-7061-4bc4-8133-e8140146f8d8",
                "name": "Demo",
                "type": "Mule Application",
                "environmentId": null,
                "organizationId": "674dba46-0d53-48d6-a390-86b1460bbd0a",
                "globalConfigurations": [],
                "flows": [],
                "dependencies": [],
                "enrichers": {},
                "catalogs": {},
                "topLevelElements": [],
                "metadata": null,
                "deleted": false,
                "revision": 0,
                "version": "1.0",
                "description": null,
                "createdBy": "amirkhan-ak-mulesoft",
                "createdDate": "2021-09-20T08:38:47",
                "lastUpdatedDate": "2021-09-20T08:45:12"
            },
            {
                ...
            },
            {
                ...
            },
            {
                ...
            },
            ...
            ...
        ]
        

In order to retrieve data for "id", I need to use the fetchJson in the following format. Note that in the requesting URL we need to provide the organizationId which has been extracted in the **User Information** sheet before at cell B4, which we will be referring here. Also we will create a Index in order to iterate through the resultset and get all items. The column A will contain the Index. 

    =fetchJSON(Credentials!A$2 & "/designcenter/api/v1/organizations/" & 'User Information'!B$4 & "/projects",Credentials!D$2, A2 & "/id")
    
    
Also iferror() function will make sure, errors are handled properly. 

For the remaining attributes, the following formula is used. 
- Name

        =iferror(fetchJSON(Credentials!A$2 & "/designcenter/api/v1/organizations/" & 'User Information'!B$4 & "/projects",Credentials!D$2, A2 & "/name"),"")
        
- Type

        =iferror(fetchJSON(Credentials!A$2 & "/designcenter/api/v1/organizations/" & 'User Information'!B$4 & "/projects",Credentials!D$2, A2 & "/type"),"")

- organizationId

        =iferror(fetchJSON(Credentials!A$2 & "/designcenter/api/v1/organizations/" & 'User Information'!B$4 & "/projects",Credentials!D$2, A2 & "/organizationId"),"")

- createdBy	

        =iferror(fetchJSON(Credentials!A$2 & "/designcenter/api/v1/organizations/" & 'User Information'!B$4 & "/projects",Credentials!$D2, A2 & "/createdBy"),"")

- createdDate	

        =iferror(fetchJSON(Credentials!A$2 & "/designcenter/api/v1/organizations/" & 'User Information'!B$4 & "/projects",Credentials!D$2, A2 & "/createdDate"),"")
        
- lastUpdatedDate

        =iferror(fetchJSON(Credentials!A$2 & "/designcenter/api/v1/organizations/" & 'User Information'!B$4 & "/projects",Credentials!D$2, A2 & "/lastUpdatedDate"),"")
 
 As a result the following sheet is automatically populated:
 
 ![image](https://user-images.githubusercontent.com/86777111/137488319-55c4baae-d61c-4a1a-bd7c-56509f0d200b.png)

### Build an Exchange Sheet
The concept and approach is the same for all the sheets except Runtime / CloudHub, as there additional Headers will be required. Following one example how the Formula will look like for **Exchange** Sheet.

![image](https://user-images.githubusercontent.com/86777111/137488786-b0cdd26f-c06a-4542-a6d2-14cc9bd3608f.png)

### Build a API Manager Sheet
The concept and approach is the same for all the sheets except Runtime / CloudHub, as there additional Headers will be required. Following one example how the Formula will look like for **API Manager** Sheet.


![image](https://user-images.githubusercontent.com/86777111/137489135-d7a3e596-aa5c-4809-8bae-424e578894bb.png)

## fetchJsonWithHeaders
The fetchJsonWithHeaders formula is used to retrieve the data from CloudHub (Runtime Manager) and the generated token from the fetchToken formula, which has been stored in the Credentialssheet in the cell D2. This will be important to use in all upcoming formulas.

The fetchJsonWithHeaders function uses the following syntax:
    =fetchJsonWithHeaders(url, token, orgId, envId, xpath)
    
**url** represents the Anypoint Platform url of the resource which should be retrieved. This could be "https://anypoint.mulesoft.com/exchange/api/v2/assets" to retrieve all assets from Exchange or "https://anypoint.mulesoft.com/apiplatform/repository/v2/organizations/{organizationId}/users" to retrieve all users from the platform. The url already contains the initial url from fetchToken, so we can use a reference to the Credentials sheet parameter URL. 

**token** represents the authentication token, which has been received after user has been logged into the platform. Also here, we will refer to the token generated from fetchToken formula in the Credentials sheets cell D2. 

**orgId** represents the organizationId for the user

**environmentId** represents the environment for which the request should retrieve data from CloudHub.

**xpath** represents the node which should be extracted into the cell where the formula is used. 

### Build CloudHub / Runtime Manager Sheet.
The concept of retrieving data is exactly the same as before, the only addition is the orgnizationId and environmentId in the formula as input parameter. Also these parameters have been part of the previous sheets, so these can be easily retrieved from there. 

![image](https://user-images.githubusercontent.com/86777111/137489811-d6031bf5-5d0d-4c80-a618-4c3ea560b2b3.png)


# Watch the demo
Watch the demo, how the final product should be retrieving the information from Anypoint Platform using the Platform APIs. 
https://www.youtube.com/watch?v=KJ4qgHr8xY4

## Caution
This is a contribution to the MuleSoft community by [Amir Khan](https://www.linkedin.com/in/amir-khan-ak). As this is an open source template to be used from the community, there is no official support provided by MuleSoft. 

### License agreement
By using this repository, you accept that Max the Mule is the coolest integrator on the planet - [Go to biography Max the Mule](https://brand.salesforce.com/content/characters-overview__3?tab=BogXMx2m)

