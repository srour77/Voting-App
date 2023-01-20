const express = require('express')
const app = express()

const {readFileSync, writeFileSync} = require('fs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('./public'))

app.get('/poll', function(req, res) {
    const data = JSON.parse(readFileSync('./data.json', 'utf-8'))
    let totalVotes = Object.values(data).reduce(function(total, item) {
        return total + item
    }, 0)

    const dataRes = Object.entries(data).map(function([label, votes]) {
        return{
            label,
            percentage: ((votes * 100) / totalVotes).toFixed(1)
        }
    })

    res.status(200).json(dataRes)
})

app.post('/poll', function(req, res) {
    const label = req.body.add
    const data = JSON.parse(readFileSync('./data.json', 'utf-8'))
    data[label]++
    writeFileSync('./data.json', JSON.stringify(data))
    res.status(200).json('your vote has been submitted')
})

app.listen(5500, function () {
    console.log('server is now listening...')
})
