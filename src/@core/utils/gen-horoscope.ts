import type { ZodiacSign, ChineseZodiac } from "../type/horoscope.type";

export class HoroscopeGenerator {
    private date: Date;
    private month: number;
    private day: number;
    private year: number;

    constructor(dateString: Date) {
        this.date = dateString;
        this.month = this.date.getMonth() + 1;
        this.day = this.date.getDate();
        this.year = this.date.getFullYear();
    }

    private getHoroscope(): ZodiacSign {
        const horoscopes: { sign: ZodiacSign, start: number, end: number }[] = [
            { sign: 'Capricorn', start: 1222, end: 119 },
            { sign: 'Aquarius', start: 120, end: 218 },
            { sign: 'Pisces', start: 219, end: 320 },
            { sign: 'Aries', start: 321, end: 419 },
            { sign: 'Taurus', start: 420, end: 520 },
            { sign: 'Gemini', start: 521, end: 620 },
            { sign: 'Cancer', start: 621, end: 722 },
            { sign: 'Leo', start: 723, end: 822 },
            { sign: 'Virgo', start: 823, end: 922 },
            { sign: 'Libra', start: 923, end: 1022 },
            { sign: 'Scorpio', start: 1023, end: 1121 },
            { sign: 'Sagittarius', start: 1122, end: 1221 },
        ];

        const dateCode = this.month * 100 + this.day;

        return horoscopes.find(({ start, end }) => (dateCode >= start || dateCode <= end))!.sign;
    }

    private getChineseZodiac(): ChineseZodiac {
        const zodiacs: ChineseZodiac[] = [
            'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
            'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
        ];

        return zodiacs[(this.year - 4) % 12];
    }

    public generate(): { horoscope: ZodiacSign, chineseZodiac: ChineseZodiac } {
        const horoscope = this.getHoroscope();
        const chineseZodiac = this.getChineseZodiac();

        return { horoscope, chineseZodiac };
    }
}