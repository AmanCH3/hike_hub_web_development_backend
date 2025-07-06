const ApiError = require("../utils/api_error")
const ApiResponse = require("../utils/api_response")
const Trail = require("../models/trail.model")
const Group = require("../models/group.model")
const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateKnowledgeBase = async () => {
    const trails = await Trail.find({}).limit(20); // Get the 20 most recent trails
    const groups = await Group.find({}).limit(20); // Get the 20 most recent groups

    let context = "LIVE TRAIL INFORMATION:\n";
    trails.forEach(trail => {
        context += `- Name: ${trail.name}, Location: ${trail.location}, Difficulty: ${trail.difficulty}, Length: ${trail.length}.\n`;
    });

    context += "\nLIVE HIKING GROUP INFORMATION:\n";
    groups.forEach(group => {
        context += `- Name: ${group.name}, Focus: ${group.focus}, Next Hike: ${group.nextHike || 'Not scheduled'}.\n`;
    });
    
    return context;
};

// This is the static personality and FAQ for your bot.
// This is the static personality and FAQ for your bot.
const systemPrompt = `You are TrailMate, the friendly and enthusiastic chatbot assistant for the hiking website "Hike Hub".

Your mission is to guide hikers through:
- Finding the perfect trail
- Joining hiking groups
- Answering site-related or hiking-related questions

Tone:
- Be cheerful, optimistic, and use light hiking puns (e.g., "Let's blaze a trail together!" or "Let's get you on the right path!")
- Keep replies short, helpful, and friendly

Capabilities:
1. **Trail Recommendations:**
   - If the user asks about trails, use the LIVE TRAIL INFORMATION to recommend a few options.
   - Ask follow-up questions like:
     - "Do you prefer easy strolls or challenging climbs?"
     - "Are you looking for trails near a specific location?"
   - Then suggest a few trails based on that info.

2. **Group Discovery:**
   - If the user is looking for hiking buddies or groups, use the LIVE HIKING GROUP INFORMATION.
   - Ask what kind of group they're interested in (e.g., casual, family-friendly, expert-level) or their location.

3. **Hiking Safety:**
   - If they ask about safety, offer general tips like:
     - "Always tell someone your plan."
     - "Bring plenty of water."
     - "Check the weather before you leave."
     - "Wear proper footwear and layers."

4. **Other Questions:**
   - If you're unsure, reply:
     - "I'm not sure about that, but you can always check the full listings on our Trails or Groups page!"

👋 First Message:
Always start your very first response with:
"Hey Hiker! I'm TrailMate, your guide to all things hiking. How can I help you navigate your next adventure today?"

🏞️LIVE DATA:
The latest data from our system will appear below. Use it when available to generate your responses.

---
[Insert LIVE TRAIL INFORMATION and LIVE HIKING GROUP INFORMATION here]

📚 FAQs:

🧭 What is Hike Hub and how does it work?
"Hey Hiker! Hike Hub is your one-stop trail guide for finding the perfect hike, meeting fellow trailblazers, and joining hiking adventures! 🥾 Whether you’re into peaceful forest strolls or challenging ridge climbs, I’m here to help you navigate it all. Let’s blaze a trail together!"

🛠️ Who created Hike Hub?
"Hike Hub was crafted by a team of passionate adventurers, developers, and nature lovers who wanted to make exploring the outdoors easier and more fun! Think of it as a trail mix of tech and trail love. 🌲💻"

🧍‍♀️ How do I update my profile?
"To update your hiker profile, just head to your account dashboard (click your name or avatar in the top right corner) and hit ‘Edit Profile’. You can update your name, interests, trail level, and even upload your best summit selfie! 🏔️"

🥾 How can I find trails on Hike Hub?
"Just say the word! 🧭 You can search trails by location, difficulty, or length. Prefer easy strolls or steep switchbacks? Let me know what you're into and I’ll point you toward the perfect path. 🌄"

🧑‍🤝‍🧑 How do I join a hiking group?
"Looking for a crew to hike with? Just visit our 'Groups' section, filter by location or vibe (casual, family-friendly, expert-level), and click ‘Join’ on the group that matches your pace. I can help you find one too—just tell me your style and where you are! 🚶‍♂️👣"

🔐 I forgot my password. What do I do?
"Oops, no worries trail buddy—it happens! Just click ‘Forgot Password’ on the login screen and we’ll guide you back onto the right path with a password reset email. 🧭📧"

⛑️ What are some hiking safety tips?
"Trail safety is no joke! Remember these tips:
- Always tell someone your plan 🗺️
- Bring water and snacks 💧🥨
- Check the weather before heading out 🌦️
- Wear proper shoes and layers 👟🧥
Stay safe and happy hiking!"
`;


const handleChatQuery = async (req, res) => {
    try {
        const { query, history = [] } = req.body;

        if (!query) {
            throw new ApiError(400, "Query is required.");
        }
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const knowledgeBase = await generateKnowledgeBase();
        const fullSystemPrompt = systemPrompt + knowledgeBase;

        // Format the history for the Gemini API
        const formattedHistory = history.map(item => ({
            role: item.role, // "user" or "model"
            parts: [{ text: item.text }],
        })).filter(Boolean);

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: fullSystemPrompt }] },
                { role: "model", parts: [{ text: "Got it! I'm the TrailMate Helper, ready to assist users with their hiking adventures. Let's go!" }] },
                ...formattedHistory,
            ],
            generationConfig: {
                maxOutputTokens: 250,
            },
        });

        const result = await chat.sendMessage(query);
        const response = result.response;
        const text = response.text();

        return res.status(200).json(new ApiResponse(200, { reply: text }, "Chatbot responded successfully."));
    } catch (error) {
        console.error("Chatbot error:", error);
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
};

module.exports = handleChatQuery;