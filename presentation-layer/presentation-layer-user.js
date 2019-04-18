//<p><strong>Profile Name: </strong><%= data.name %></p>
//<p><strong>Email: </strong><%= data.author %></p>
//<p><strong>Picture URL: </strong><%= data.blogPostUrl %></p>

// Get data from business layer via a HTTP GET request to the /get-user/:useremail route
function getDataFromBusinessLayer() {
    event.preventDefault();
    const email = $('#email').val();

    // Perform the GET request to the business layer
    $.ajax({ 
        url: `http://localhost:8081/get-user/${email}`, 
        type: "GET",
        success: function (user) {
            // Now display it on the screen
            const description = `<p>The data retrieved below was retrieved from the business layer through an HTTP GET request. \
            The business layer then handled the GET request and passed along the email address to the data layer.  The data layer \
            then received the email address and performed a database call to retrieve the user with that email from the database.  \
            The calls happened in the following sequence:</p>
            <p><span class="code">getDataFromBusinessLayer()</span> (Presentation layer)</p>
            <p><span class="code">HTTP GET /get-user/${user.email}</span> (Presentation Layer)</p>
            <p><span class="code">db.getUserByEmail(\"${user.email}\")</span> (Business Layer)</p> 
            <p><span class="code">User.findOne(\"${user.email}\")</span> (Data Layer)</p>`
            const elem1 = `<p><strong>Name: </strong>${user.name}</p>`;
            const elem2 = `<p><strong>Email: </strong>${user.email}</p>`;
            const elem3 = `<p><strong>Profile Picture URL: </strong>${user.profileUrl}</p>`;
            $("#user-container").append(description, elem1, elem2, elem3);
        },
        error: function (jqXHR, textStatus, ex) {
            console.log(textStatus + "," + ex + "," + jqXHR.responseText);
        }
    });
}