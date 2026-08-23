async function testAboutAPI() {
  try {
    const data = {
      about: "This is test about text.",
      education: [
        {
          period: "2020-2024",
          degree: "B.Tech",
          institution: "University",
          details: ["Detail 1", "Detail 2"]
        }
      ],
      certifications: [
        {
          period: "2024",
          title: "Test Cert",
          issuer: "Udemy",
          details: ["Completed"]
        }
      ]
    };
    
    console.log('Sending POST request...');
    const postResponse = await fetch('http://localhost:5000/api/portfolio/about', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const postJson = await postResponse.json();
    console.log('POST Response:', JSON.stringify(postJson, null, 2));
    
    console.log('Sending GET request...');
    const getResponse = await fetch('http://localhost:5000/api/portfolio/about');
    const getJson = await getResponse.json();
    console.log('GET Response:', JSON.stringify(getJson, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAboutAPI();
