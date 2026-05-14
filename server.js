const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'change-me'

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/testdb').then(() => {
    console.log("connected to MongoDB")
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err)
})

const userProfileSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: String,
    displayName: String,
    fullName: String,
    district: String,
    role: { type: String, enum: ['admin', 'farmer', 'owner', 'manager', 'worker'], required: true },
    farmId: String,
    createdAt: { type: String, required: true }
})

const farmSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: String,
    totalArea: Number,
    ownerId: { type: String, required: true },
    components: [{ type: String, enum: ['crops', 'livestock', 'poultry', 'fisheries', 'agroforestry', 'waste_recycling'] }],
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true }
})

const inventoryItemSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    farmId: { type: String, required: true },
    category: { type: String, enum: ['crops', 'livestock', 'poultry', 'fisheries', 'agroforestry', 'waste_recycling'], required: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    status: { type: String, required: true },
    metadata: { type: Object, default: {} },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true }
})

const synergySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    farmId: { type: String, required: true },
    sourceComponent: { type: String, enum: ['crops', 'livestock', 'poultry', 'fisheries', 'agroforestry', 'waste_recycling'], required: true },
    targetComponent: { type: String, enum: ['crops', 'livestock', 'poultry', 'fisheries', 'agroforestry', 'waste_recycling'], required: true },
    material: { type: String, required: true },
    amount: Number,
    frequency: String,
    description: String,
    isActive: { type: Boolean, required: true }
})

const farmTaskSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    farmId: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    category: { type: String, required: true },
    status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled'], required: true },
    dueBy: String,
    assignedTo: String,
    priority: { type: String, enum: ['low', 'medium', 'high'], required: true }
})

const UserProfile = mongoose.model('UserProfile', userProfileSchema)
const Farm = mongoose.model('Farm', farmSchema)
const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema)
const Synergy = mongoose.model('Synergy', synergySchema)
const FarmTask = mongoose.model('FarmTask', farmTaskSchema)

const savedRecommendationSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    crop: { type: String, required: true },
    district: { type: String, required: true },
    season: { type: String, required: true },
    advice: { type: String, required: true },
    createdAt: { type: String, required: true }
})

const SavedRecommendation = mongoose.model('SavedRecommendation', savedRecommendationSchema)

function createToken(user) {
    return jwt.sign(
        {
            uid: user.uid,
            email: user.email,
            role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' },
    )
}

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const token = authHeader.replace('Bearer ', '')
    try {
        const payload = jwt.verify(token, JWT_SECRET)
        req.user = payload
        next()
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' })
    }
}

app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' })
})

app.post('/api/auth/signup', async (req, res) => {
    try {
        const { fullName, email, password, district } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' })
        }
        const existing = await UserProfile.findOne({ email })
        if (existing) {
            return res.status(400).json({ error: 'A user with that email already exists.' })
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const uid = new mongoose.Types.ObjectId().toString()
        const now = new Date().toISOString()
        const user = new UserProfile({
            uid,
            email,
            passwordHash,
            displayName: fullName,
            fullName,
            district,
            role: 'farmer',
            createdAt: now,
        })
        await user.save()
        res.json({ message: 'Account created successfully.' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await UserProfile.findOne({ email })
        if (!user || !user.passwordHash) {
            return res.status(401).json({ error: 'Invalid email or password.' })
        }
        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) {
            return res.status(401).json({ error: 'Invalid email or password.' })
        }
        const token = createToken(user)
        res.json({
            token,
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                fullName: user.fullName,
                district: user.district,
                role: user.role,
            },
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/auth/me', authMiddleware, async (req, res) => {
    try {
        const user = await UserProfile.findOne({ uid: req.user.uid })
        if (!user) return res.status(404).json({ error: 'User not found.' })
        res.json({
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                fullName: user.fullName,
                district: user.district,
                role: user.role,
            },
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/recommendations', authMiddleware, async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { userId: req.user.uid }
        const recs = await SavedRecommendation.find(query).sort({ createdAt: -1 })
        res.json(recs)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.post('/api/recommendations', authMiddleware, async (req, res) => {
    try {
        const { crop, district, season, advice } = req.body
        const id = new mongoose.Types.ObjectId().toString()
        const now = new Date().toISOString()
        const rec = new SavedRecommendation({
            id,
            userId: req.user.uid,
            crop,
            district,
            season,
            advice,
            createdAt: now,
        })
        await rec.save()
        res.json(rec)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.delete('/api/recommendations/:id', authMiddleware, async (req, res) => {
    try {
        const rec = await SavedRecommendation.findOne({ id: req.params.id })
        if (!rec) return res.status(404).json({ error: 'Recommendation not found.' })
        if (rec.userId !== req.user.uid && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' })
        }
        await rec.deleteOne()
        res.json({ message: 'Recommendation deleted.' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/admin/overview', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' })
        }
        const [profiles, recommendations] = await Promise.all([
            UserProfile.find(),
            SavedRecommendation.find().sort({ createdAt: -1 }),
        ])
        res.json({ profiles, recommendations })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/users/:uid', async (req, res) => {
    try {
        const user = await UserProfile.findOne({ uid: req.params.uid })
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.post('/api/users', async (req, res) => {
    try {
        const user = new UserProfile(req.body)
        await user.save()
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.put('/api/users/:uid', async (req, res) => {
    try {
        const user = await UserProfile.findOneAndUpdate({ uid: req.params.uid }, req.body, { new: true })
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/farms/:id', async (req, res) => {
    try {
        const farm = await Farm.findOne({ id: req.params.id })
        res.json(farm)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/farms', async (req, res) => {
    try {
        const farms = await Farm.find()
        res.json(farms)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.post('/api/farms', async (req, res) => {
    try {
        const farm = new Farm(req.body)
        await farm.save()
        res.json(farm)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.put('/api/farms/:id', async (req, res) => {
    try {
        const farm = await Farm.findOneAndUpdate({ id: req.params.id }, req.body, { new: true })
        res.json(farm)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.delete('/api/farms/:id', async (req, res) => {
    try {
        await Farm.findOneAndDelete({ id: req.params.id })
        res.json({ message: 'Farm deleted' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Inventory routes
app.get('/api/inventory/:farmId', async (req, res) => {
    try {
        const items = await InventoryItem.find({ farmId: req.params.farmId })
        res.json(items)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.post('/api/inventory', async (req, res) => {
    try {
        const item = new InventoryItem(req.body)
        await item.save()
        res.json(item)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.put('/api/inventory/:id', async (req, res) => {
    try {
        const item = await InventoryItem.findOneAndUpdate({ id: req.params.id }, req.body, { new: true })
        res.json(item)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.delete('/api/inventory/:id', async (req, res) => {
    try {
        await InventoryItem.findOneAndDelete({ id: req.params.id })
        res.json({ message: 'Inventory item deleted' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Synergy routes
app.get('/api/synergies/:farmId', async (req, res) => {
    try {
        const synergies = await Synergy.find({ farmId: req.params.farmId })
        res.json(synergies)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.post('/api/synergies', async (req, res) => {
    try {
        const synergy = new Synergy(req.body)
        await synergy.save()
        res.json(synergy)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.put('/api/synergies/:id', async (req, res) => {
    try {
        const synergy = await Synergy.findOneAndUpdate({ id: req.params.id }, req.body, { new: true })
        res.json(synergy)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.delete('/api/synergies/:id', async (req, res) => {
    try {
        await Synergy.findOneAndDelete({ id: req.params.id })
        res.json({ message: 'Synergy deleted' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Task routes
app.get('/api/tasks/:farmId', async (req, res) => {
    try {
        const tasks = await FarmTask.find({ farmId: req.params.farmId })
        res.json(tasks)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.post('/api/tasks', async (req, res) => {
    try {
        const task = new FarmTask(req.body)
        await task.save()
        res.json(task)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.put('/api/tasks/:id', async (req, res) => {
    try {
        const task = await FarmTask.findOneAndUpdate({ id: req.params.id }, req.body, { new: true })
        res.json(task)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await FarmTask.findOneAndDelete({ id: req.params.id })
        res.json({ message: 'Task deleted' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get('/', (req, res) => {
    res.send("connected successfully")
})

app.listen(2000, () => {
    console.log("server on http://localhost:2000")
})