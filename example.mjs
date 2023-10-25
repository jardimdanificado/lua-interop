import { LuaSession, tolua, fromlua } from './lua-interop.mjs';

const lua0 = new LuaSession('luajit');
const lua1 = new LuaSession('luajit');

lua0.setDefaultTimeout(1000);

lua0.registerCallback('exampleprinter', (data) =>
{
    console.log(`Lua0: ${data}`);
});

lua0.registerCallback('simpleprinter', (data) =>
{
    return data;
});


const complexTestObject = {
    a: 1,
    b: 2,
    c: { a: 2, b: [1, 2, 3, 4, 5] }
};

let teste = lua0.call(`

call('exampleprinter', 'just a call')
call('exampleprinter', 'just a call')

call('exampleprinter', 'just a call')

text('done')


`,1000);

let versiculos = lua1.text(`#  א ALEPH.
¹ Blessed are the undefiled in the way, who walk in the law of the LORD.
² Blessed are they that keep his testimonies, and that seek him with the whole heart.
³ They also do no iniquity: they walk in his ways.
⁴ Thou hast commanded us to keep thy precepts diligently.
⁵ O that my ways were directed to keep thy statutes!
⁶ Then shall I not be ashamed, when I have respect unto all thy commandments.
⁷ I will praise thee with uprightness of heart, when I shall have learned thy righteous judgments.
⁸ I will keep thy statutes: O forsake me not utterly.
#  ב BETH.
⁹ Wherewithal shall a young man cleanse his way? by taking heed thereto according to thy word.
¹⁰ With my whole heart have I sought thee: O let me not wander from thy commandments.
¹¹ Thy word have I hid in mine heart, that I might not sin against thee.
¹² Blessed art thou, O LORD: teach me thy statutes.
¹³ With my lips have I declared all the judgments of thy mouth.
¹⁴ I have rejoiced in the way of thy testimonies, as much as in all riches.
¹⁵ I will meditate in thy precepts, and have respect unto thy ways.
¹⁶ I will delight myself in thy statutes: I will not forget thy word.
#  ג GIMEL.
¹⁷ Deal bountifully with thy servant, that I may live, and keep thy word.
¹⁸ Open thou mine eyes, that I may behold wondrous things out of thy law.
¹⁹ I am a stranger in the earth: hide not thy commandments from me.
²⁰ My soul breaketh for the longing that it hath unto thy judgments at all times.
²¹ Thou hast rebuked the proud that are cursed, which do err from thy commandments.
²² Remove from me reproach and contempt; for I have kept thy testimonies.
²³ Princes also did sit and speak against me: but thy servant did meditate in thy statutes.
²⁴ Thy testimonies also are my delight and my counsellors.
#  ד DALETH.
²⁵ My soul cleaveth unto the dust: quicken thou me according to thy word.
²⁶ I have declared my ways, and thou heardest me: teach me thy statutes.
²⁷ Make me to understand the way of thy precepts: so shall I talk of thy wondrous works.
²⁸ My soul melteth for heaviness: strengthen thou me according unto thy word.
²⁹ Remove from me the way of lying: and grant me thy law graciously.
³⁰ I have chosen the way of truth: thy judgments have I laid before me.
³¹ I have stuck unto thy testimonies: O LORD, put me not to shame.
³² I will run the way of thy commandments, when thou shalt enlarge my heart.
#  ה HE.
³³ Teach me, O LORD, the way of thy statutes; and I shall keep it unto the end.
³⁴ Give me understanding, and I shall keep thy law; yea, I shall observe it with my whole heart.
³⁵ Make me to go in the path of thy commandments; for therein do I delight.
³⁶ Incline my heart unto thy testimonies, and not to covetousness.
³⁷ Turn away mine eyes from beholding vanity; and quicken thou me in thy way.
³⁸ Stablish thy word unto thy servant, who is devoted to thy fear.
³⁹ Turn away my reproach which I fear: for thy judgments are good.
⁴⁰ Behold, I have longed after thy precepts: quicken me in thy righteousness.
#  ו VAU.
⁴¹ Let thy mercies come also unto me, O LORD, even thy salvation, according to thy word.
⁴² So shall I have wherewith to answer him that reproacheth me: for I trust in thy word.
⁴³ And take not the word of truth utterly out of my mouth; for I have hoped in thy judgments.
⁴⁴ So shall I keep thy law continually for ever and ever.
⁴⁵ And I will walk at liberty: for I seek thy precepts.
⁴⁶ I will speak of thy testimonies also before kings, and will not be ashamed.
⁴⁷ And I will delight myself in thy commandments, which I have loved.
⁴⁸ My hands also will I lift up unto thy commandments, which I have loved; and I will meditate in thy statutes.
#  ז ZAIN.
⁴⁹ Remember the word unto thy servant, upon which thou hast caused me to hope.
⁵⁰ This is my comfort in my affliction: for thy word hath quickened me.
⁵¹ The proud have had me greatly in derision: yet have I not declined from thy law.
⁵² I remembered thy judgments of old, O LORD; and have comforted myself.
⁵³ Horror hath taken hold upon me because of the wicked that forsake thy law.
⁵⁴ Thy statutes have been my songs in the house of my pilgrimage.
⁵⁵ I have remembered thy name, O LORD, in the night, and have kept thy law.
⁵⁶ This I had, because I kept thy precepts.
#  ח CHETH.
⁵⁷ Thou art my portion, O LORD: I have said that I would keep thy words.
⁵⁸ I intreated thy favour with my whole heart: be merciful unto me according to thy word.
⁵⁹ I thought on my ways, and turned my feet unto thy testimonies.
⁶⁰ I made haste, and delayed not to keep thy commandments.
⁶¹ The bands of the wicked have robbed me: but I have not forgotten thy law.
⁶² At midnight I will rise to give thanks unto thee because of thy righteous judgments.
⁶³ I am a companion of all them that fear thee, and of them that keep thy precepts.
⁶⁴ The earth, O LORD, is full of thy mercy: teach me thy statutes.
#  ט TETH.
⁶⁵ Thou hast dealt well with thy servant, O LORD, according unto thy word.
⁶⁶ Teach me good judgment and knowledge: for I have believed thy commandments.
⁶⁷ Before I was afflicted I went astray: but now have I kept thy word.
⁶⁸ Thou art good, and doest good; teach me thy statutes.
⁶⁹ The proud have forged a lie against me: but I will keep thy precepts with my whole heart.
⁷⁰ Their heart is as fat as grease; but I delight in thy law.
⁷¹ It is good for me that I have been afflicted; that I might learn thy statutes.
⁷² The law of thy mouth is better unto me than thousands of gold and silver.
#  י JOD.
⁷³ Thy hands have made me and fashioned me: give me understanding, that I may learn thy commandments.
⁷⁴ They that fear thee will be glad when they see me; because I have hoped in thy word.
⁷⁵ I know, O LORD, that thy judgments are right, and that thou in faithfulness hast afflicted me.
⁷⁶ Let, I pray thee, thy merciful kindness be for my comfort, according to thy word unto thy servant.
⁷⁷ Let thy tender mercies come unto me, that I may live: for thy law is my delight.
⁷⁸ Let the proud be ashamed; for they dealt perversely with me without a cause: but I will meditate in thy precepts.
⁷⁹ Let those that fear thee turn unto me, and those that have known thy testimonies.
⁸⁰ Let my heart be sound in thy statutes; that I be not ashamed.
#  כ CAPH.
⁸¹ My soul fainteth for thy salvation: but I hope in thy word.
⁸² Mine eyes fail for thy word, saying, When wilt thou comfort me?
⁸³ For I am become like a bottle in the smoke; yet do I not forget thy statutes.
⁸⁴ How many are the days of thy servant? when wilt thou execute judgment on them that persecute me?
⁸⁵ The proud have digged pits for me, which are not after thy law.
⁸⁶ All thy commandments are faithful: they persecute me wrongfully; help thou me.
⁸⁷ They had almost consumed me upon earth; but I forsook not thy precepts.
⁸⁸ Quicken me after thy lovingkindness; so shall I keep the testimony of thy mouth.
#  ל LAMED.
⁸⁹ For ever, O LORD, thy word is settled in heaven.
⁹⁰ Thy faithfulness is unto all generations: thou hast established the earth, and it abideth.
⁹¹ They continue this day according to thine ordinances: for all are thy servants.
⁹² Unless thy law had been my delights, I should then have perished in mine affliction.
⁹³ I will never forget thy precepts: for with them thou hast quickened me.
⁹⁴ I am thine, save me; for I have sought thy precepts.
⁹⁵ The wicked have waited for me to destroy me: but I will consider thy testimonies.
⁹⁶ I have seen an end of all perfection: but thy commandment is exceeding broad.
#  מ MEM.
⁹⁷ O how love I thy law! it is my meditation all the day.
⁹⁸ Thou through thy commandments hast made me wiser than mine enemies: for they are ever with me.
⁹⁹ I have more understanding than all my teachers: for thy testimonies are my meditation.
¹⁰⁰ I understand more than the ancients, because I keep thy precepts.
¹⁰¹ I have refrained my feet from every evil way, that I might keep thy word.
¹⁰² I have not departed from thy judgments: for thou hast taught me.
¹⁰³ How sweet are thy words unto my taste! yea, sweeter than honey to my mouth!
¹⁰⁴ Through thy precepts I get understanding: therefore I hate every false way.
#  נ NUN.
¹⁰⁵ Thy word is a lamp unto my feet, and a light unto my path.
¹⁰⁶ I have sworn, and I will perform it, that I will keep thy righteous judgments.
¹⁰⁷ I am afflicted very much: quicken me, O LORD, according unto thy word.
¹⁰⁸ Accept, I beseech thee, the freewill offerings of my mouth, O LORD, and teach me thy judgments.
¹⁰⁹ My soul is continually in my hand: yet do I not forget thy law.
¹¹⁰ The wicked have laid a snare for me: yet I erred not from thy precepts.
¹¹¹ Thy testimonies have I taken as an heritage for ever: for they are the rejoicing of my heart.
¹¹² I have inclined mine heart to perform thy statutes alway, even unto the end.
#  ס SAMECH.
¹¹³ I hate vain thoughts: but thy law do I love.
¹¹⁴ Thou art my hiding place and my shield: I hope in thy word.
¹¹⁵ Depart from me, ye evildoers: for I will keep the commandments of my God.
¹¹⁶ Uphold me according unto thy word, that I may live: and let me not be ashamed of my hope.
¹¹⁷ Hold thou me up, and I shall be safe: and I will have respect unto thy statutes continually.
¹¹⁸ Thou hast trodden down all them that err from thy statutes: for their deceit is falsehood.
¹¹⁹ Thou puttest away all the wicked of the earth like dross: therefore I love thy testimonies.
¹²⁰ My flesh trembleth for fear of thee; and I am afraid of thy judgments.
#  ע AIN.
¹²¹ I have done judgment and justice: leave me not to mine oppressors.
¹²² Be surety for thy servant for good: let not the proud oppress me.
¹²³ Mine eyes fail for thy salvation, and for the word of thy righteousness.
¹²⁴ Deal with thy servant according unto thy mercy, and teach me thy statutes.
¹²⁵ I am thy servant; give me understanding, that I may know thy testimonies.
¹²⁶ It is time for thee, LORD, to work: for they have made void thy law.
¹²⁷ Therefore I love thy commandments above gold; yea, above fine gold.
¹²⁸ Therefore I esteem all thy precepts concerning all things to be right; and I hate every false way.
#  פ PE.
¹²⁹ Thy testimonies are wonderful: therefore doth my soul keep them.
¹³⁰ The entrance of thy words giveth light; it giveth understanding unto the simple.
¹³¹ I opened my mouth, and panted: for I longed for thy commandments.
¹³² Look thou upon me, and be merciful unto me, as thou usest to do unto those that love thy name.
¹³³ Order my steps in thy word: and let not any iniquity have dominion over me.
¹³⁴ Deliver me from the oppression of man: so will I keep thy precepts.
¹³⁵ Make thy face to shine upon thy servant; and teach me thy statutes.
¹³⁶ Rivers of waters run down mine eyes, because they keep not thy law.
#  צ TZADDI.
¹³⁷ Righteous art thou, O LORD, and upright are thy judgments.
¹³⁸ Thy testimonies that thou hast commanded are righteous and very faithful.
¹³⁹ My zeal hath consumed me, because mine enemies have forgotten thy words.
¹⁴⁰ Thy word is very pure: therefore thy servant loveth it.
¹⁴¹ I am small and despised: yet do not I forget thy precepts.
¹⁴² Thy righteousness is an everlasting righteousness, and thy law is the truth.
¹⁴³ Trouble and anguish have taken hold on me: yet thy commandments are my delights.
¹⁴⁴ The righteousness of thy testimonies is everlasting: give me understanding, and I shall live.
#  ק KOPH.
¹⁴⁵ I cried with my whole heart; hear me, O LORD: I will keep thy statutes.
¹⁴⁶ I cried unto thee; save me, and I shall keep thy testimonies.
¹⁴⁷ I prevented the dawning of the morning, and cried: I hoped in thy word.
¹⁴⁸ Mine eyes prevent the night watches, that I might meditate in thy word.
¹⁴⁹ Hear my voice according unto thy lovingkindness: O LORD, quicken me according to thy judgment.
¹⁵⁰ They draw nigh that follow after mischief: they are far from thy law.
¹⁵¹ Thou art near, O LORD; and all thy commandments are truth.
¹⁵² Concerning thy testimonies, I have known of old that thou hast founded them for ever.
#  ר RESH.
¹⁵³ Consider mine affliction, and deliver me: for I do not forget thy law.
¹⁵⁴ Plead my cause, and deliver me: quicken me according to thy word.
¹⁵⁵ Salvation is far from the wicked: for they seek not thy statutes.
¹⁵⁶ Great are thy tender mercies, O LORD: quicken me according to thy judgments.
¹⁵⁷ Many are my persecutors and mine enemies; yet do I not decline from thy testimonies.
¹⁵⁸ I beheld the transgressors, and was grieved; because they kept not thy word.
¹⁵⁹ Consider how I love thy precepts: quicken me, O LORD, according to thy lovingkindness.
¹⁶⁰ Thy word is true from the beginning: and every one of thy righteous judgments endureth for ever.
#  ש SCHIN.
¹⁶¹ Princes have persecuted me without a cause: but my heart standeth in awe of thy word.
¹⁶² I rejoice at thy word, as one that findeth great spoil.
¹⁶³ I hate and abhor lying: but thy law do I love.
¹⁶⁴ Seven times a day do I praise thee because of thy righteous judgments.
¹⁶⁵ Great peace have they which love thy law: and nothing shall offend them.
¹⁶⁶ LORD, I have hoped for thy salvation, and done thy commandments.
¹⁶⁷ My soul hath kept thy testimonies; and I love them exceedingly.
¹⁶⁸ I have kept thy precepts and thy testimonies: for all my ways are before thee.
#  ת TAU.
¹⁶⁹ Let my cry come near before thee, O LORD: give me understanding according to thy word.
¹⁷⁰ Let my supplication come before thee: deliver me according to thy word.
¹⁷¹ My lips shall utter praise, when thou hast taught me thy statutes.
¹⁷² My tongue shall speak of thy word: for all thy commandments are righteousness.
¹⁷³ Let thine hand help me; for I have chosen thy precepts.
¹⁷⁴ I have longed for thy salvation, O LORD; and thy law is my delight.
¹⁷⁵ Let my soul live, and it shall praise thee; and let thy judgments help me.
¹⁷⁶ I have gone astray like a lost sheep; seek thy servant; for I do not forget thy commandments. 

Salmos 119:1-176`);

const luaOperations = [
    versiculos,
    teste,
    lua0.json(tolua(complexTestObject)),
    lua1.eval('text("Operation 2 - lua0.eval")'),
    lua0.text('Operation 3 - lua0.text'),
    lua1.eval('text("Operation 4 - lua0.eval")'),
    lua0.text('Operation 5 - lua0.text'),
    lua1.json(tolua({ data: "Operation 6" })),
    lua0.json(tolua({ data: "Operation 7" })),
    lua1.json(tolua({ data: "Operation 8" })),
    lua0.json(tolua({ data: "Operation 9" })),
    lua1.json(tolua({ data: "Operation 10" })),
    lua0.json(tolua({ data: "Operation 11" })),
    lua1.json(tolua({ data: "Operation 12" })),
    lua0.json(tolua({ data: "Operation 13" })),
    lua1.json(tolua({ data: "Operation 14" })),
    lua0.json(tolua({ data: "Operation 15" })),
    lua1.eval('text("Operation 16 - lua0.eval")'),
    lua0.eval('text("Operation 17 - lua0.eval")'),
    lua1.text('Operation 18 - lua0.text'),
    lua0.eval('text("Operation 19 - lua0.eval")'),
    lua1.text('Operation 20 - lua0.text'),
    lua0.json(tolua({ data: "Operation 21" })),
    lua1.json(tolua({ data: "Operation 22" })),
    lua0.json(tolua({ data: "Operation 23" })),
    lua1.json(tolua({ data: "Operation 24" })),
    lua0.json(tolua({ data: "Operation 25" })),
];
let luaResults = [];
// Execute as operações em um loop
for (const operation of luaOperations) 
{
    luaResults.push(operation);
}

// Use Promise.all para aguardar a conclusão de todas as Promises
const allResults = await Promise.all(luaResults);

console.log(allResults);

lua0.close();
lua1.close();