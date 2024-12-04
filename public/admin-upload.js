try {
    const response = await fetch("http://localhost:3000/api/upload-bulk", {
        method: "POST",
        body: formData,
    });

    if (response.ok) {
        const result = await response.json();
        document.querySelector("#upload-status").textContent = result.message;
        console.log("File upload result:", result); // Debug log
    } else {
        const errorData = await response.json();
        document.querySelector("#upload-status").textContent = errorData.error || "Upload failed.";
    }
} catch (error) {
    console.error("Error uploading file:", error);
    document.querySelector("#upload-status").textContent = "An error occurred.";
}
