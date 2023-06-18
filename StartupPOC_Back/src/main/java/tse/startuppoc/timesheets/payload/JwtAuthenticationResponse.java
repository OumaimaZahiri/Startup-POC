package tse.startuppoc.timesheets.payload;

/** This class manages mainly the tokens' generation and exchange between the front and the back
 *  It also gets the data of a user's connection once he's connected or displayed
 * @author oumai
 *
 */
public class JwtAuthenticationResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private String role;   
    private Long id;
    private String firstname;
    private String lastname;
    private String photos;

	public JwtAuthenticationResponse(String accessToken) {
        this.accessToken = accessToken;
    }
    
    public JwtAuthenticationResponse(String accessToken, String role) {
        this.accessToken = accessToken;
        this.role = role;
    }
    
    public JwtAuthenticationResponse(String accessToken, String role,Long id, String firstname, String lastname, String photos) {
        this.accessToken = accessToken;
        this.role = role;
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.photos = photos;
    }


    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
    

    public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public String getPhotos() {
		return photos;
	}

	public void setPhotos(String photos) {
		this.photos = photos;
	}
	
	
}
