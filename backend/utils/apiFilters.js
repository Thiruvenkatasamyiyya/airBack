class ApiFilters{
    constructor(query,queryStr){
        this.query = query,
        this.queryStr = queryStr
    }

    search(){
        const from = this.queryStr.from ? {
            "departure.airport" : {
                $regex : this.queryStr.from,
                $options: 'i'
            } 
        }: {}

        const to = this.queryStr.to ? {
            "arrival.airport" : {
                $regex : this.queryStr.to,
                $options : "i"
            }
        } : {}

        this.query = this.query.find({...from, ...to})

        return this
    }

    filter() {
        this.query = this.query.find({ "flight.number": { $ne: null },
            "flight.codeshared" : {$ne : null} });
        return this;
    }
}

export default ApiFilters