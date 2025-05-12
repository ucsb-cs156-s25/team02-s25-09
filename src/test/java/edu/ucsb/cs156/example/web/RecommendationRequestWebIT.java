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

    //     assertThat(page.getByTestId("RestaurantTable-cell-row-0-col-description"))
    //             .hasText("Build your own burrito chain");

    //     page.getByTestId("RestaurantTable-cell-row-0-col-Edit-button").click();
    //     assertThat(page.getByText("Edit Restaurant")).isVisible();
    //     page.getByTestId("RestaurantForm-description").fill("THE BEST");
    //     page.getByTestId("RestaurantForm-submit").click();

    //     assertThat(page.getByTestId("RestaurantTable-cell-row-0-col-description")).hasText("THE BEST");

    //     page.getByTestId("RestaurantTable-cell-row-0-col-Delete-button").click();

    //     assertThat(page.getByTestId("RestaurantTable-cell-row-0-col-name")).not().isVisible();
    }

    // @Test
    // public void regular_user_cannot_create_restaurant() throws Exception {
    //     setupUser(false);

    //     page.getByText("Restaurants").click();

    //     assertThat(page.getByText("Create Restaurant")).not().isVisible();
    //     assertThat(page.getByTestId("RestaurantTable-cell-row-0-col-name")).not().isVisible();
    // }
}