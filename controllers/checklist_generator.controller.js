const checklistData = require('../data/checklistData');

exports.generateChecklist = async (req, res) => {
    try {
        const { experience, duration, weather } = req.query;

        if (!experience || !duration || !weather) {
            return res.status(400).json({ success: false, message: "Missing required query parameters." });
        }

        // Start with a deep copy of the base items
        let finalChecklist = JSON.parse(JSON.stringify(checklistData.base));

        // Helper function to add items without duplicates
        const addItem = (category, newItem) => {
            if (!finalChecklist[category].some(item => item.id === newItem.id)) {
                finalChecklist[category].push(newItem);
            }
        };

        // Add items based on filters
        if (checklistData.experience[experience]) {
            checklistData.experience[experience].forEach(addon => addItem(addon.category, addon.item));
        }
        if (checklistData.duration[duration]) {
            checklistData.duration[duration].forEach(addon => addItem(addon.category, addon.item));
        }
        if (checklistData.weather[weather]) {
            checklistData.weather[weather].forEach(addon => addItem(addon.category, addon.item));
        }

        res.status(200).json({ success: true, data: finalChecklist });

    } catch (error) {
        console.error("Generate checklist error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};