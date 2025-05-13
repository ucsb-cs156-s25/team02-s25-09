package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import java.time.LocalDateTime;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestsWebIT extends WebTestCase {

    @Autowired
        HelpRequestRepository helpRequestRepository;

    @Test
    public void admin_user_can_create_edit_delete_helprequest() throws Exception {
        LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

        HelpRequest helpRequest1 = HelpRequest.builder()
            .requesterEmail("jsanchez98@ucsb.edu")
            .teamId("9")
            .tableOrBreakoutRoom("table 9")
            .requestTime(ldt1)
            .explanation("I need help")
            .solved(false)
            .build();
                        
        helpRequestRepository.save(helpRequest1);
        
        setupUser(true);

        page.getByText("Help Requests").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
                .hasText("jsanchez98@ucsb.edu");

        page.getByTestId("HelpRequestTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_helprequest() throws Exception {
        setupUser(false);

        page.getByText("Help Requests").click();

        assertThat(page.getByText("Create Help Request")).not().isVisible();
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }

    @Test
    public void admin_user_can_see_create_helprequest() throws Exception {
        setupUser(true);

        page.getByText("Help Requests").click();

        assertThat(page.getByText("Create Help Request")).isVisible();
    }
}