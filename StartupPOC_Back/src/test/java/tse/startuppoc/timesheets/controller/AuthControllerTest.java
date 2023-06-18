package tse.startuppoc.timesheets.controller;

import static org.junit.Assert.assertEquals;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.databind.ObjectMapper;

import tse.startuppoc.timesheets.controller.AuthController;
import tse.startuppoc.timesheets.model.User;
import tse.startuppoc.timesheets.payload.LoginRequest;
import tse.startuppoc.timesheets.payload.SignUpRequest;
import tse.startuppoc.timesheets.repository.UserRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = AuthController.class)
public class AuthControllerTest {

	@MockBean
    UserRepository userRepository;
	
    @Autowired
    WebApplicationContext webApplicationContext;


    @Autowired private WebApplicationContext wac;
    private MockMvc mockMvc;
    
    @Before
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }

    ObjectMapper mapper=new ObjectMapper();

    @Test
    public void testUserCreate()throws Exception{
        SignUpRequest request=new SignUpRequest();
        request.setFirstname("test");
        request.setLastname("create");
        request.setEmail("test@cc.com");
        request.setUserRole("");
        request.setPassword("123456");

        User user=new User();
        user.setFirstname("test");
        user.setLastname("test");
        user.setEmail("test@cc.com");
        user.setUsername("test@cc.com");
        user.setPassword("123456");

        String uriSignUp="/api/auth/signup";
        
        mockMvc.perform(MockMvcRequestBuilders
        		.post("/api/auth/signup")
        		.content(mapper.writeValueAsString(user))
                .header("Content-Type",MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON_VALUE));

        userRepository.save(user);

        MvcResult mvcResultSignUp=mockMvc.perform(MockMvcRequestBuilders.post(uriSignUp)
        .contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(user))).andReturn();

        int status=mvcResultSignUp.getResponse().getStatus();
        assertEquals(201,status);
        String content =mvcResultSignUp.getResponse().getContentAsString();
        assertEquals(content,"Successfully created");
    }
    
	@Test
	public void testSignIn() throws Exception {

        String uriSignIn="/api/auth/signin";
        
        LoginRequest request = new LoginRequest();
        request.setUsername("test@cc.com");
        request.setPassword("123456");

		mockMvc.perform(MockMvcRequestBuilders
				.post(uriSignIn)
				.content(mapper.writeValueAsString(new UsernamePasswordAuthenticationToken(
						request.getUsername(),
						request.getPassword())))
				.contentType(MediaType.APPLICATION_JSON)
			    .accept(MediaType.APPLICATION_JSON));
	}
	
}
