import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";
import {Pie, PieChart} from "recharts";
import {Checkbox} from "@/components/ui/checkbox";
import {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";
import {useToPng} from "@hugocxl/react-to-image";
import {toast, Toaster} from "sonner"
import {Button} from "@/components/ui/button";
import Cookies from "js-cookie";


export default function Home() {

    enum Party {
        CommunistsOfRussia = 'Communists Of Russia',
        AgrarianUnion = 'Agrarian Union',
        Rossiya = 'Rossiya',
        Fatherland = 'Fatherland',
        IndustrialUnion = 'Industrial Union',
        WorkersUnion = 'Worker\'s Union',
        Change = 'Change',
        Rodina = 'Rodina',
        SovereigntyAndEquality = 'Sovereignty & Equality',
        FreeRussia = 'Free Russia',
        LeftOfCenter = 'Left of Center',
        ConcordForProgress = 'Concord for Progress',
        DemocraticRussia = 'Democratic Russia',
        RadicalDemocrats = 'Radical Democrats',
    }

    const congressBreakdown = new Map<Party, {
        label: string,
        votes: number,
        color: string,
        members: number,
        name: string
    }>([

        [Party.CommunistsOfRussia, {
            label: 'Communists of Russia',
            votes: 67,
            color: '#FF000B',
            members: 1,
            name: 'communistsOfRussia'
        }],
        [Party.AgrarianUnion, {
            label: 'Agrarian Union',
            votes: 130,
            color: '#11806A',
            members: 2,
            name: 'agrarianUnion'
        }],
        [Party.Rossiya, {label: 'Rossiya', votes: 43, color: '#A83515', members: 2, name: 'rossiya'}],
        [Party.Fatherland, {label: 'Fatherland', votes: 51, color: '#490200', members: 2, name: 'fatherland'}],
        [Party.IndustrialUnion, {
            label: 'Industrial Union',
            votes: 52,
            color: '#546E7A',
            members: 1,
            name: 'industrialUnion'
        }],
        [Party.WorkersUnion, {label: 'Worker\'s Union', votes: 53, color: '#FD3C3C', members: 1, name: 'workersUnion'}],
        [Party.Change, {label: 'Change', votes: 53, color: '#AAAAAA', members: 1, name: 'change'}],
        [Party.Rodina, {label: 'Rodina', votes: 57, color: '#D1923C', members: 2, name: 'rodina'}],
        [Party.SovereigntyAndEquality, {
            label: 'Sovereignty & Equality',
            votes: 50,
            color: '#00431D',
            members: 1,
            name: 'sovereigntyAndEquality'
        }],
        [Party.FreeRussia, {label: 'Free Russia', votes: 55, color: '#78C9FF', members: 2, name: 'freeRussia'}],
        [Party.LeftOfCenter, {label: 'Left of Center', votes: 62, color: '#E91E63', members: 1, name: 'leftOfCenter'}],
        [Party.ConcordForProgress, {
            label: 'Concord for Progress',
            votes: 54,
            color: '#9B59B6',
            members: 1,
            name: 'concordForProgress'
        }],
        [Party.DemocraticRussia, {
            label: 'Democratic Russia',
            votes: 49,
            color: '#3498DB',
            members: 1,
            name: 'democraticRussia'
        }],
        [Party.RadicalDemocrats, {
            label: 'Radical Democrats',
            votes: 50,
            color: '#F1C40F',
            members: 1,
            name: 'radicalDemocrats'
        }],
    ]);

    const playerParties: {
        name: string,
        party: Party,
        vote: string,
        setVote: undefined | Dispatch<SetStateAction<string>>
    }[] = [
        {name: 'I.P. Rybkin', party: Party.CommunistsOfRussia, vote: '', setVote: undefined},
        {name: 'Mikhail I. Lapshin', party: Party.AgrarianUnion, vote: '', setVote: undefined},
        {name: 'Vladimir S. Zakharov', party: Party.AgrarianUnion, vote: '', setVote: undefined},
        {name: 'S.N.Baburin', party: Party.Rossiya, vote: '', setVote: undefined},
        {name: 'L.Kh.Bakhtiyarova', party: Party.Rossiya, vote: '', setVote: undefined},
        {name: 'B.V . Tarasov', party: Party.Fatherland, vote: '', setVote: undefined},
        {name: 'Gennadiy Matveyevich Benov', party: Party.Fatherland, vote: '', setVote: undefined},
        {name: 'V .V . Bespalov', party: Party.IndustrialUnion, vote: '', setVote: undefined},
        {name: 'V.V. Chernov', party: Party.WorkersUnion, vote: '', setVote: undefined},
        {name: 'V.A. Shuykov', party: Party.Change, vote: '', setVote: undefined},
        {name: 'U.E. Temirov', party: Party.SovereigntyAndEquality, vote: '', setVote: undefined},
        {name: 'V.M. Adrov', party: Party.FreeRussia, vote: '', setVote: undefined},
        {name: 'I.V . Vinogradova', party: Party.FreeRussia, vote: '', setVote: undefined},
        {name: 'V.I. Gerasimov', party: Party.LeftOfCenter, vote: '', setVote: undefined},
        {name: 'S.P.Shustov', party: Party.DemocraticRussia, vote: '', setVote: undefined},
        {name: 'Sergei N. Yushenkov', party: Party.RadicalDemocrats, vote: '', setVote: undefined},
        {name: 'Konstantin G. Bulgakov', party: Party.Rodina, vote: '', setVote: undefined},
        {name: 'V .I. Morokin', party: Party.Rodina, vote: '', setVote: undefined},
        {name: 'Droren', party: Party.ConcordForProgress, vote: '', setVote: undefined},
    ]

    const votesToGet66 = 546;
    const votesToGet50 = 414;
    const [totalVotes, setTotalVotes] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    //region Votes State
    const [vote0, setVote0] = useState<string>('abstain');
    playerParties[0].vote = vote0;
    playerParties[0].setVote = setVote0;
    const [vote1, setVote1] = useState<string>('abstain');
    playerParties[1].vote = vote1;
    playerParties[1].setVote = setVote1;
    const [vote2, setVote2] = useState<string>('abstain');
    playerParties[2].vote = vote2;
    playerParties[2].setVote = setVote2;
    const [vote3, setVote3] = useState<string>('abstain');
    playerParties[3].vote = vote3;
    playerParties[3].setVote = setVote3;
    const [vote4, setVote4] = useState<string>('abstain');
    playerParties[4].vote = vote4;
    playerParties[4].setVote = setVote4;
    const [vote5, setVote5] = useState<string>('abstain');
    playerParties[5].vote = vote5;
    playerParties[5].setVote = setVote5;
    const [vote6, setVote6] = useState<string>('abstain');
    playerParties[6].vote = vote6;
    playerParties[6].setVote = setVote6;
    const [vote7, setVote7] = useState<string>('abstain');
    playerParties[7].vote = vote7;
    playerParties[7].setVote = setVote7;
    const [vote8, setVote8] = useState<string>('abstain');
    playerParties[8].vote = vote8;
    playerParties[8].setVote = setVote8;
    const [vote9, setVote9] = useState<string>('abstain');
    playerParties[9].vote = vote9;
    playerParties[9].setVote = setVote9;
    const [vote10, setVote10] = useState<string>('abstain');
    playerParties[10].vote = vote10;
    playerParties[10].setVote = setVote10;
    const [vote11, setVote11] = useState<string>('abstain');
    playerParties[11].vote = vote11;
    playerParties[11].setVote = setVote11;
    const [vote12, setVote12] = useState<string>('abstain');
    playerParties[12].vote = vote12;
    playerParties[12].setVote = setVote12;
    const [vote13, setVote13] = useState<string>('abstain');
    playerParties[13].vote = vote13;
    playerParties[13].setVote = setVote13;
    const [vote14, setVote14] = useState<string>('abstain');
    playerParties[14].vote = vote14;
    playerParties[14].setVote = setVote14;
    const [vote15, setVote15] = useState<string>('abstain');
    playerParties[15].vote = vote15;
    playerParties[15].setVote = setVote15;
    const [vote16, setVote16] = useState<string>('abstain');
    playerParties[16].vote = vote16;
    playerParties[16].setVote = setVote16;
    const [vote17, setVote17] = useState<string>('abstain');
    playerParties[17].vote = vote17;
    playerParties[17].setVote = setVote17;
    const [vote18, setVote18] = useState<string>('abstain');
    playerParties[18].vote = vote18;
    playerParties[18].setVote = setVote18;
    //endregion

    const [votingTally, setVotingTally] = useState<{ party: string, votes: number, fill: string }[]>([]);
    const chartConfig = {
        voters: {
            label: "Voters",
        },
        communistsOfRussia: {
            label: congressBreakdown.get(Party.CommunistsOfRussia)?.label,
            color: congressBreakdown.get(Party.CommunistsOfRussia)?.color,
        },
        agrarianUnion: {
            label: congressBreakdown.get(Party.AgrarianUnion)?.label,
            color: congressBreakdown.get(Party.AgrarianUnion)?.color,
        },
        rossiya: {
            label: congressBreakdown.get(Party.Rossiya)?.label,
            color: congressBreakdown.get(Party.Rossiya)?.color,
        },
        fatherland: {
            label: congressBreakdown.get(Party.Fatherland)?.label,
            color: congressBreakdown.get(Party.Fatherland)?.color,
        },
        industrialUnion: {
            label: congressBreakdown.get(Party.IndustrialUnion)?.label,
            color: congressBreakdown.get(Party.IndustrialUnion)?.color,
        },
        workersUnion: {
            label: congressBreakdown.get(Party.WorkersUnion)?.label,
            color: congressBreakdown.get(Party.WorkersUnion)?.color,
        },
        change: {
            label: congressBreakdown.get(Party.Change)?.label,
            color: congressBreakdown.get(Party.Change)?.color,
        },
        rodina: {
            label: congressBreakdown.get(Party.Rodina)?.label,
            color: congressBreakdown.get(Party.Rodina)?.color,
        },
        sovereigntyAndEquality: {
            label: congressBreakdown.get(Party.SovereigntyAndEquality)?.label,
            color: congressBreakdown.get(Party.SovereigntyAndEquality)?.color,
        },
        freeRussia: {
            label: congressBreakdown.get(Party.FreeRussia)?.label,
            color: congressBreakdown.get(Party.FreeRussia)?.color,
        },
        leftOfCenter: {
            label: congressBreakdown.get(Party.LeftOfCenter)?.label,
            color: congressBreakdown.get(Party.LeftOfCenter)?.color,
        },
        concordForProgress: {
            label: congressBreakdown.get(Party.ConcordForProgress)?.label,
            color: congressBreakdown.get(Party.ConcordForProgress)?.color,
        },
        democraticRussia: {
            label: congressBreakdown.get(Party.DemocraticRussia)?.label,
            color: congressBreakdown.get(Party.DemocraticRussia)?.color,
        },
        radicalDemocrats: {
            label: congressBreakdown.get(Party.RadicalDemocrats)?.label,
            color: congressBreakdown.get(Party.RadicalDemocrats)?.color,
        },
    };

    const updateTally = useCallback(() => {
        if (isLoading) return;
        const tally: { party: string, votes: number, fill: string }[] = [];
        const partyVotes = new Map<Party, {
            totalVotes: number,
            votesToBeGiven: number,
            yes: number,
            no: number,
            totalVotesAvailable: number
        }>();
        congressBreakdown.forEach((value, key) => {
            partyVotes.set(key, {
                totalVotes: value.members,
                votesToBeGiven: 0,
                yes: 0,
                no: 0,
                totalVotesAvailable: value.votes
            });
        });
        playerParties.forEach((player) => {
            if (player.vote === 'yes') partyVotes.get(player.party)!.yes += 1;
            if (player.vote === 'no') partyVotes.get(player.party)!.no += 1;
        });
        partyVotes.forEach((votes, party) => {
            if (votes.yes === votes.totalVotes) {
                votes.votesToBeGiven = votes.totalVotesAvailable;
            } else if (votes.yes === 1 && votes.totalVotes === 2 && votes.no === 1) {
                votes.votesToBeGiven = Math.ceil(votes.totalVotesAvailable / 2);
            } else if (votes.yes === 1 && votes.totalVotes === 2 && votes.no === 0) {
                votes.votesToBeGiven = votes.totalVotesAvailable;
            }
            if (votes.votesToBeGiven > 0) {
                tally.push({
                    party: congressBreakdown.get(party)!.name,
                    votes: votes.votesToBeGiven,
                    fill: congressBreakdown.get(party)!.color
                });
            }
        });
        setVotingTally(tally);
        setTotalVotes(tally.reduce((acc, curr) => acc + curr.votes, 0));
        Cookies.set('votes', JSON.stringify(playerParties.filter(x => x.vote !== 'abstain').map((player) => ({
            name: player.name,
            vote: player.vote
        }))), {path: '/', expires: 7});
    }, [isLoading, congressBreakdown, playerParties]);

    useEffect(() => {
        if (!isLoading) return;
        const votes = Cookies.get('votes');
        if (votes) {
            const parsedVotes: { name: string, vote: string }[] = JSON.parse(votes);
            parsedVotes.forEach((vote) => {
                const player = playerParties.find((p) => p.name === vote.name);
                if (player) {
                    player.setVote!(vote.vote);
                }
            });
        }
        setIsLoading(false);
    }, [isLoading, updateTally]);


    useEffect(() => {
        updateTally();
    }, [vote0, vote1, vote2, vote3, vote4, vote5, vote6, vote7, vote8, vote9, vote10, vote11, vote12, vote13, vote14, vote15, vote16, vote17, vote18, isLoading]);

    const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    const [, convert, ref] = useToPng<HTMLDivElement>({
        onSuccess: data => {
            // 'data' is the base64 encoded PNG
            // You can use it to display the image, copy to clipboard, etc.
            const header = 'data:image/png;base64,';
            const base64 = data.substring(header.length);

            const blob = b64toBlob(base64, 'image/png');

            navigator.clipboard.write([new ClipboardItem({'image/png': blob})]);

            toast.success("Image copied to clipboard!");
        }
    });

    return (
        <div className={'flex flex-col justify-center items-center my-10 gap-8'}>
            <Toaster/>
            <h1>Vote Tallying</h1>
            <div className="absolute top-4 right-4">
                <Button onClick={convert} className="cursor-pointer">Copy Tally to Clipboard</Button>
            </div>
            <Card className="flex flex-col w-[32rem]" ref={ref}>
                <CardHeader className="items-center pb-0">
                    <CardTitle>Vote Totals</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-0 w-full">
                    <ChartContainer
                        config={chartConfig}
                        className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[500px] pb-0 w-full"
                    >
                        <PieChart data={votingTally} dataKey="votes">
                            <ChartTooltip content={<ChartTooltipContent/>}/>
                            <Pie data={votingTally} dataKey="votes" label labelLine={false} nameKey="party"/>
                            <ChartLegend
                                content={<ChartLegendContent nameKey="party"/>}
                                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                            />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="text-center">
                        Total Votes: <span className="font-bold text-blue-500">{totalVotes}</span><br/>
                        Votes needed for 50%+1: <span className="font-bold">{votesToGet50}</span><br/>
                        Votes needed for 66%: <span className="font-bold">{votesToGet66}</span>
                    </div>
                    <div>
                        Status:{' '}
                        {totalVotes >= votesToGet66 ? (
                            <span className="font-bold text-green-600">Passed with 66% Majority</span>
                        ) : totalVotes >= votesToGet50 ? (
                            <span className="font-bold text-yellow-600">Passed with Simple Majority</span>
                        ) : (
                            <span className="font-bold text-red-600">Did Not Pass</span>
                        )}
                    </div>
                </CardFooter>
            </Card>
            <Card className="flex flex-col w-full">
                <CardHeader>
                    <CardTitle>Voting Players</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex gap-4 border-b p-2 font-bold flex-wrap'>
                        {playerParties.map((player, index) => (
                            <div key={index} style={{fontWeight: 'bold', flexBasis: '28rem'}}
                                 className='flex gap-4 border-2 p-2 items-center rounded-xl justify-between'>
                                <div className='flex gap-4 items-center'>
                                    {player.name} <span style={{
                                    color: congressBreakdown.get(player.party)?.color
                                }}>[{player.party}]</span>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <Checkbox
                                        className={'bg-green-200 data-[state=checked]:bg-green-600 cursor-pointer w-8 h-8'}
                                        checked={player.vote === 'yes'}
                                        onCheckedChange={(value) => {
                                            if (value as boolean) {
                                                player.setVote!('yes');
                                            } else {
                                                player.setVote!('abstain');
                                            }
                                        }}/>
                                    <Checkbox
                                        className={'bg-red-200 data-[state=checked]:bg-red-600 cursor-pointer w-8 h-8'}
                                        checked={player.vote === 'no'}
                                        onCheckedChange={(value) => {
                                            if (value as boolean) {
                                                player.setVote!('no');
                                            } else {
                                                player.setVote!('abstain');
                                            }
                                        }}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
