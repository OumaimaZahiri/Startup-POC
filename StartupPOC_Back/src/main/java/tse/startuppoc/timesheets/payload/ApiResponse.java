package tse.startuppoc.timesheets.payload;

/** This class makes the management of api responses easier
 * We could visualise the status (true or false) of the response,
 * the data sent by the api and the message (message of an error 
 * for example)
 * @author oumai
 *
 */
public class ApiResponse {
    private Boolean status;
    private Object data;
    private String message;

    public ApiResponse(Boolean status, Object data, String message) {
        this.status = status;
        this.data = data;
        this.message = message;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
