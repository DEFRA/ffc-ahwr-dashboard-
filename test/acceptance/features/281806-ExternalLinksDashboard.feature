@smoketest1
Feature:US-281806-External links on Manage your claims screen
Scenario: AC1- check external links visible on manage your claims page
    Given the user is on the /vet-visits page
    Then user login with Single business crn and password(for DefraId)
    Then Accept the Cookies
    # check-details page content development in progress
    When user check the business details
    And user confirm the org-review page
    And user agreed the business details is correct
    Then user continue to next page
    Then user confirm manage your claims page
    Then confirm terms and conditions link is visible
    Then confirm guidance for review link is visible
    Then confirm agreement summary link is visible

Scenario:AC4- Service name link on the header
    Then user confirm manage your claims page
    Then user is able to see the Annual health and welfare review of livestock link on the middle top of the header

Scenario: AC2- validate feedback link on manage your claims page
    Then confirm feedback link is visible
    When user clicks on the feedback link
    Then validate user redirected to survey page

Scenario: AC3- Gov.uk link on the header
    Then user confirm manage your claims page
    Then click on gov.uk in the left pane
    Then validate if the user redirected to gov.uk 

