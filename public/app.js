/* DONE:

  1. Make a reusable function for creating a table body in index.html with the results from your MongoDB query
  Each row should have info for one animal.

  2. Make two AJAX functions that fire when users click the two buttons on index.html.
      a. When the user clicks the Weight button, the table should display the animal data sorted by weight.
      b. When the user clicks the Name button, the table should display the animal data sorted by name.

  Good luck!

  *Hint*: We don't want to keep adding to the table with each button click. We only want to show the new results.
  What can we do to the table to accomplish this?
  

  *Bonus*: Write code to set an 'active' state on the column header. It should make the color sorted-by column red.
  *Bonus*: Add additional ways to sort (e.g. by class or number of legs)
*/

$(document).ready(function() {

  $("#time-id-sort").on("click", function(event) {
    console.log("FE: SCRAPE ID(TIME)-SORT /scraperev Got Hit");
    event.preventDefault();
    var getDataURL = "/scraperev"; // Reverse order for MOST RECENT first
    $.ajax({
      url: getDataURL,
      method:"GET",
      success: function(response) {
        displayResults(response);
        console.log("Scraperev _ID/TIME AJAX response: ", response);
      },
      error: function(err){
        alert("Scraperev WEIGHT AJAX response error: ", err);
      }
    });
  });

  $("#title-sort").on("click", function(event) {
    console.log("FE: TITLE SORT Got Hit");
    event.preventDefault();
    var getDataURL = "/scrape";
    $.ajax({
      url: getDataURL,
      method:"GET",
      success: function(response) {
        displayResults(response);
        console.log("Scrape TITLE-SORT AJAX response: ", response);
      },
      error: function(err){
        alert("Scrape TITLE AJAX response error: ", err);
      }
    });
  });

  $("#clear-data").on("click", function(event) {
    console.log("FE: CLEAR DATA Got Hit");
    event.preventDefault();
    var getDataURL = "/clear";
    $.ajax({
      url: getDataURL,
      method:"GET",
      success: function(response) {
        displayResults(response);
        console.log("Scrape CLEAR-DATA response: ", response);
      },
      error: function(err){
        alert("Scrape CLEAR AJAX response error: ", err);
      }
    });
  });



  // We'll be rewriting the table's data frequently, so let's make our code more DRY
  // by writing a function that takes in data (JSON) and creates a table body
  function displayResults(data) {
    console.log("FE: displayResults Got CALLED: ", data);
    // Clear whats there
    $(".table-body-list").empty();
    if (data === "Hello CLEARED world") {
      $(".table-body-list").text("Results Cleared");
    } else {
      // Add to the table here...
      data.forEach(function(scrape, idx) {
        // console.log("scrape._id: ", scrape._id);
        // console.log("scrape.title: ", scrape.title);
        // console.log("scrape.link: ", scrape.link);
        var dispaly_link = '<a href="' + scrape.link + '">' + scrape.link + '</a>';
        console.log("dispaly_link: ", dispaly_link);
        var tr = $("<tr>").append(
          $("<td>").text(scrape._id),
          $("<td>").text(scrape.title),
          // $("<td>").text(scrape.link)
          $("<td>").html(dispaly_link)
        );
        $(".table-body-list").append(tr);
      })
    }
  }
});

$.getJSON("/all", function(data) {
  console.log("FE: /all Got Hit: ", data);
  // Call our function to generate a table body

  displayResults(data);
});
