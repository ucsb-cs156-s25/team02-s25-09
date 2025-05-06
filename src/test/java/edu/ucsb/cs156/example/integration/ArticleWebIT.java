package edu.ucsb.cs156.example.integration;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.http.MediaType;

import edu.ucsb.cs156.example.testconfig.TestConfig;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestConfig.class)
public class ArticleWebIT {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(roles = { "USER" })
    public void test_getArticles_returns_200() throws Exception {
        mockMvc.perform(get("/api/articles/all"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = { "USER" })
    public void test_getArticleById_returns_200() throws Exception {
        mockMvc.perform(get("/api/articles?id=1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = { "ADMIN", "USER" })
    public void test_postArticle_returns_200() throws Exception {
        mockMvc.perform(post("/api/articles/post")
                .with(csrf())
                .param("title", "Test Article")
                .param("url", "https://example.com/test")
                .param("explanation", "This is a test article")
                .param("email", "test@example.com")
                .param("dateAdded", "2022-01-01T12:00:00"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = { "ADMIN", "USER" })
    public void test_putArticle_returns_200() throws Exception {
        // First create an article to update
        mockMvc.perform(post("/api/articles/post")
                .with(csrf())
                .param("title", "Original Article")
                .param("url", "https://example.com/original")
                .param("explanation", "This is the original article")
                .param("email", "original@example.com")
                .param("dateAdded", "2022-01-01T12:00:00"))
                .andExpect(status().isOk());
        
        // Then update it with a JSON body
        String requestBody = "{"
                + "\"title\": \"Updated Article\","
                + "\"url\": \"https://example.com/updated\","
                + "\"explanation\": \"This is an updated article\","
                + "\"email\": \"update@example.com\","
                + "\"dateAdded\": \"2022-01-02T12:00:00\""
                + "}";
        
        mockMvc.perform(put("/api/articles")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)
                .param("id", "1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = { "ADMIN", "USER" })
    public void test_deleteArticle_returns_200() throws Exception {
        mockMvc.perform(delete("/api/articles")
                .with(csrf())
                .param("id", "1"))
                .andExpect(status().isOk());
    }
}