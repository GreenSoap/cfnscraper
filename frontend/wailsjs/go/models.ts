export namespace main {
	
	export class MatchHistory {
	    cfn: string;
	    lp: number;
	    lpGain: number;
	    wins: number;
	    totalWins: number;
	    totalLosses: number;
	    totalMatches: number;
	    losses: number;
	    winRate: number;
	    opponent: string;
	    opponentCharacter: string;
	    opponentLP: string;
	    result: boolean;
	    timestamp: string;
	    winStreak: number;
	
	    static createFrom(source: any = {}) {
	        return new MatchHistory(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.cfn = source["cfn"];
	        this.lp = source["lp"];
	        this.lpGain = source["lpGain"];
	        this.wins = source["wins"];
	        this.totalWins = source["totalWins"];
	        this.totalLosses = source["totalLosses"];
	        this.totalMatches = source["totalMatches"];
	        this.losses = source["losses"];
	        this.winRate = source["winRate"];
	        this.opponent = source["opponent"];
	        this.opponentCharacter = source["opponentCharacter"];
	        this.opponentLP = source["opponentLP"];
	        this.result = source["result"];
	        this.timestamp = source["timestamp"];
	        this.winStreak = source["winStreak"];
	    }
	}

}
