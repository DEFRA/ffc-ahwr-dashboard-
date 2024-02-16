@smoketest
Feature:US-283094-Empty dashboard on Manage your claims screen
Scenario: AC1 validate empty dashboard history with no previous claim
    Given the user is on the /vet-visits page
    When redirected to Defra ID page
    Then user login with Single business crn and password(for DefraId)
    Then Accept the Cookies
    # check-detail page content development in progress
    When user check the business details
    And user confirm the org-review page
    And user agreed the business details is correct
    Then user continue to next page
    Then user confirm manage your claims page
    Then user checks your previous claims text
    Then validate empty dashboard history message

