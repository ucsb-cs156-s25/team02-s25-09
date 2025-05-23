package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBOrganizationWebIT extends WebTestCase {
    
    @Test
    public void admin_user_can_create_edit_delete_ucsborganization() throws Exception {
        setupUser(true);

        page.getByText("UCSB Organization").click();

        page.getByText("Create UCSBOrganization").click();
        assertThat(page.getByText("Create New UCSBOrganization")).isVisible();
        page.getByTestId("UCSBOrganizationForm-orgCode").fill("ZPR");
        page.getByTestId("UCSBOrganizationForm-orgTranslationShort").fill("ZETA PHI RHO");
        page.getByTestId("UCSBOrganizationForm-orgTranslation").fill("ZETA PHI RHO");
        page.getByTestId("UCSBOrganizationForm-inactive").check();
        page.getByTestId("UCSBOrganizationForm-submit").click();

        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslationShort"))
            .hasText("ZETA PHI RHO");

        page.getByTestId("UCSBOrganizationTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit UCSBOrganization")).isVisible();
        page.getByTestId("UCSBOrganizationForm-orgTranslationShort").fill("ZETA PHI RHO NEW");
        page.getByTestId("UCSBOrganizationForm-submit").click();

        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslationShort"))
            .hasText("ZETA PHI RHO NEW");

        page.getByTestId("UCSBOrganizationTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_ucsborganization() throws Exception {
        setupUser(false);

        page.getByText("UCSB Organization").click();

        assertThat(page.getByText("Create Organization")).not().isVisible();
        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode")).not().isVisible();
    }
}
