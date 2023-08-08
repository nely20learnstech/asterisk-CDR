// Function to fetch CDR data and update the table
function fetchCDRData() {
  $.get('/cdr', function (data) {
    const cdrTableBody = $('#cdrTableBody');
    cdrTableBody.empty();

    data.forEach(function (cdr) {
      // Format the call date to French format (e.g., 25/07/2023 16:19)
      const formattedDate = new Date(cdr.calldate).toLocaleString('fr-FR');

      const row = `
        <tr>
          <td>${formattedDate}</td>
          <td>${cdr.clid}</td>
          <!-- Add more table cells for other fields if needed -->
        </tr>
      `;
      cdrTableBody.append(row);
    });
  });
}

// Fetch CDR data initially when the page loads
fetchCDRData();

// Fetch CDR data every 5 seconds (you can adjust the interval as needed)
setInterval(fetchCDRData, 5000);
