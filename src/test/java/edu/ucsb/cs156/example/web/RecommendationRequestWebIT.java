package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import java.time.LocalDateTime;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_RecommendationRequest() throws Exception {
        setupUser(true);

        // LocalDateTime ldt1 = LocalDateTime.parse("2022-04-20T00:00:00");
        // LocalDateTime ldt2 = LocalDateTime.parse("2022-05-01T00:00:00");

        page.getByText("Recommendation Requests").click();

        page.getByText("Create Recommendation Request").click();
        assertThat(page.getByText("Create New Recommendation Request")).isVisible();
    
        page.getByLabel("Requester's Email").fill("tester1@ucsb.edu");
        page.getByLabel("Professor's Email").fill("tester2@ucsb.edu");
        page.getByLabel("Explanation").fill("Testing Explanation");
        page.getByLabel("Date Requested").fill("2022-04-20");
        page.getByLabel("Date Needed").fill("2022-05-01");
        page.getByLabel("Done").selectOption("True");

         page.getByTestId("RecommendationRequestForm-submit").click();
        

        assertThat(page.getByLabel("Explanation"))
                .hasValue("Testing Explanation");

        page.getByTestId("RecommendationRequestTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Recommendation Request")).isVisible();
        page.getByLabel("Explanation").fill("Testing Explanation 2");

        page.getByLabel("Date Requested").fill("2022-04-20");
        page.getByLabel("Date Needed").fill("2022-05-01");

        page.getByText("Update").click();

        assertThat(page.getByLabel("Explanation")).hasValue("Testing Explanation 2");

        page.getByTestId("RecommendationRequestTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByLabel("Explanation")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_RecommendationRequest() throws Exception {
        setupUser(false);

        page.getByText("Recommendation Requests").click();

        assertThat(page.getByText("Create Recommendation Request")).not().isVisible();
        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-name")).not().isVisible();
    }
}