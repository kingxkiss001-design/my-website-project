// --- BROWSER-ONLY SECURITY WRAPPER ---
// This ensures that server-side Node.js does not crash when it sees "window"
if (typeof window !== 'undefined') {

    function enforceSessionSecurity() {
        const sessionToken = localStorage.getItem("oms_session_token");
        const userRole = localStorage.getItem("oms_user_role");
        
        const urlSegments = window.location.pathname.split("/");
        const activeViewFile = urlSegments[urlSegments.length - 1] || "login.html";

        // Stop back browser looping mechanism
        if (window.history.state !== "secure_gate") {
            window.history.pushState("secure_gate", "", window.location.href);
        }

        // Protection logic
        if (!sessionToken) {
            if (activeViewFile === "dashboard.html" || activeViewFile === "member.html") {
                window.location.replace("login.html");
            }
        } else {
            if (activeViewFile === "login.html" || activeViewFile === "" || activeViewFile === "index.html") {
                if (userRole === "admin") {
                    window.location.replace("dashboard.html");
                } else {
                    window.location.replace("member.html");
                }
            }
        }
    }

    // Intercept PopState Events instantly
    window.addEventListener("popstate", function () {
        window.history.pushState("secure_gate", "", window.location.href);
        enforceSessionSecurity();
    });

    // Continuous security background checking loop
    setInterval(() => {
        const token = localStorage.getItem("oms_session_token");
        const pathName = window.location.pathname.split("/").pop() || "login.html";
        if (!token && (pathName === "dashboard.html" || pathName === "member.html")) {
            window.location.replace("login.html");
        }
    }, 200);

    // Run on boot
    window.history.pushState("secure_gate", "", window.location.href);
    enforceSessionSecurity();
}