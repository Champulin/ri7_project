import {  Poppins, Sofia_Sans } from "next/font/google";

export const poppins = Poppins({ 
    weight: ['400', '500', '600', '700', '800', '900'],
    style: 'normal',
    variable: '--font-poppins',
    subsets: ['latin'],
});
export const sofia = Sofia_Sans({
    weight: ['400', '500', '600', '700', '800'],
    style: 'normal',
    variable: '--font-sofia',
    subsets: ['latin'],
 });