document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("button").addEventListener("click", async (e) => {
        
        e.preventDefault();
        const prompt = document.getElementById("input").value;
        console.log(prompt);

        const outputDiv = document.getElementById("output");
        outputDiv.textContent = "GENERATING......";
        try {
            const response = await fetch("http://localhost:3000/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: prompt }) // correct 
                // body: { "prompt": prompt} error
            });

            const data = await response.json();

            let formatted = data.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
            formatted = formatted.replace(/`{1,2}([\s\S]*?)`{1,2}/g, "<i>$1</i>");

            console.log(formatted);
            outputDiv.innerHTML = data || "Error generating response.";
        } catch (error) {
            outputDiv.innerHTML = error;
        }
    });
});
