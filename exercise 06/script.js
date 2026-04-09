// Dynamically inject the form
const formContainer = document.getElementById('form-container');
formContainer.innerHTML = `
  <form id="dataForm">
    <h2>🔒 Enter Your Information</h2>

    <div class="form-group">
      <label for="username">Full Name</label>
      <input type="text" id="username" name="fullname" placeholder="Sahashradh" required>
    </div>

    <div class="form-group">
      <label for="email">Email Address</label>
      <input type="email" id="email" name="email" placeholder="sahashradh@example.com" required>
    </div>

    <fieldset>
      <legend>📌 Position</legend>
      <label><input type="radio" name="position" value="Senior Developer" required> Senior Developer</label>
      <label><input type="radio" name="position" value="Junior Developer"> Junior Developer</label>
      <label><input type="radio" name="position" value="Full Stack Engineer"> Full Stack Engineer</label>
      <label><input type="radio" name="position" value="DevOps Engineer"> DevOps Engineer</label>
    </fieldset>

    <fieldset>
      <legend>🛠️ Technical Skills</legend>
      <label><input type="checkbox" name="skills" value="React"> React</label>
      <label><input type="checkbox" name="skills" value="Node.js"> Node.js</label>
      <label><input type="checkbox" name="skills" value="Python"> Python</label>
      <label><input type="checkbox" name="skills" value="Docker"> Docker</label>
      <label><input type="checkbox" name="skills" value="AWS"> AWS</label>
    </fieldset>

    <div class="form-group">
      <label for="experience">Years of Experience</label>
      <select id="experience" name="experience" required>
        <option value="">-- Select --</option>
        <option value="0-2 years">0-2 years</option>
        <option value="2-5 years">2-5 years</option>
        <option value="5-10 years">5-10 years</option>
        <option value="10+ years">10+ years</option>
      </select>
    </div>

    <div class="form-group">
      <label for="notes">Additional Notes</label>
      <textarea id="notes" name="notes" placeholder="Tell us more about yourself..." rows="4"></textarea>
    </div>

    <button type="submit">📤 Submit Information</button>
  </form>
`;

// Handle form submission
const form = document.getElementById('dataForm');
const outputDiv = document.getElementById('output-div');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const formObj = {};

  // Process form data
  for (let [key, value] of formData.entries()) {
    if (key === 'skills') {
      // Handle multiple checkboxes
      if (!formObj[key]) {
        formObj[key] = [];
      }
      formObj[key].push(value);
    } else {
      formObj[key] = value;
    }
  }

  // Build output HTML with styled display
  let outputHTML = `
    <h3>✅ Information Received</h3>
    <ul>
      <li><span><strong>Full Name:</strong></span> <span>${formObj.fullname || 'N/A'}</span></li>
      <li><span><strong>Email:</strong></span> <span>${formObj.email || 'N/A'}</span></li>
      <li><span><strong>Position:</strong></span> <span>${formObj.position || 'N/A'}</span></li>
      <li><span><strong>Skills:</strong></span> <span>${formObj.skills ? formObj.skills.join(', ') : 'None selected'}</span></li>
      <li><span><strong>Experience:</strong></span> <span>${formObj.experience || 'N/A'}</span></li>
      <li><span><strong>Notes:</strong></span> <span>${formObj.notes || 'None provided'}</span></li>
    </ul>
  `;

  // Display the result
  outputDiv.innerHTML = outputHTML;
});