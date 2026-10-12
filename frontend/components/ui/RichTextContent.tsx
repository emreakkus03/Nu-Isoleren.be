import styles from './RichTextContent.module.css';

const richTextClasses = `
  prose prose-slate max-w-none min-w-0
  text-sm sm:text-base text-black leading-relaxed
  [overflow-wrap:anywhere]
  max-md:[&_h2]:text-center max-md:[&_h2]:text-balance

  [&_p]:mb-4
  [&_p:last-child]:mb-0
  [&_p]:text-black

  [&_strong]:font-bold
  [&_strong]:text-black

  [&_em]:italic
  [&_em]:text-black

  [&_u]:underline
  [&_u]:decoration-2
  [&_u]:underline-offset-2

  [&_s]:line-through
  [&_del]:line-through

  [&_a]:font-extrabold
  [&_a]:cursor-pointer
  [&_a]:decoration-2
  [&_a]:underline-offset-4
  [&_a]:transition-colors

  [&_h2]:mt-10
  [&_h2]:mb-4
  [&_h2]:text-xl
  [&_h2]:font-extrabold
  [&_h2]:leading-snug
  [&_h2]:tracking-tight
  [&_h2]:text-black
  sm:[&_h2]:text-2xl
  md:[&_h2]:text-3xl

  [&_h3]:mt-8
  [&_h3]:mb-3
  [&_h3]:text-xl
  [&_h3]:font-extrabold
  [&_h3]:leading-snug
  [&_h3]:text-black

  [&_ul]:my-5
  [&_ul]:list-disc
  [&_ul]:space-y-2
  [&_ul]:pl-7

  [&_ol]:my-5
  [&_ol]:list-decimal
  [&_ol]:space-y-2
  [&_ol]:pl-7

  [&_li]:my-1
  [&_li]:text-black
  [&_li]:leading-7

  [&_li::marker]:font-extrabold
  [&_li::marker]:text-[#C82024]

  [&_ul_ul]:mt-2
  [&_ul_ul]:mb-2
  [&_ul_ul]:list-[circle]

  [&_ol_ol]:mt-2
  [&_ol_ol]:mb-2

  [&_blockquote]:my-7
  [&_blockquote]:rounded-r-xl
  [&_blockquote]:border-l-4
  [&_blockquote]:border-[#1A669A]
  [&_blockquote]:bg-[#F2F8FC]
  [&_blockquote]:px-5
  [&_blockquote]:py-4
  [&_blockquote]:font-medium
  [&_blockquote]:text-slate-700

  [&_blockquote_p]:my-0

  [&_code]:rounded
  [&_code]:bg-slate-100
  [&_code]:px-1.5
  [&_code]:py-0.5
  [&_code]:font-semibold
  [&_code]:text-[#1A669A]

  [&_pre]:my-7
  [&_pre]:overflow-x-auto
  [&_pre]:rounded-xl
  [&_pre]:bg-slate-900
  [&_pre]:p-5
  [&_pre]:text-sm
  [&_pre]:text-white

  [&_pre_code]:bg-transparent
  [&_pre_code]:p-0
  [&_pre_code]:text-inherit

  [&_table]:my-7
  [&_table]:w-full
  [&_table]:border-collapse
  [&_table]:text-sm

  [&_thead]:bg-slate-50

  [&_th]:border
  [&_th]:border-slate-200
  [&_th]:px-4
  [&_th]:py-3
  [&_th]:text-left
  [&_th]:font-extrabold
  [&_th]:text-slate-900

  [&_td]:border
  [&_td]:border-slate-200
  [&_td]:px-4
  [&_td]:py-3
  [&_td]:align-top

  [&_hr]:my-9
  [&_hr]:border-0
  [&_hr]:border-t
  [&_hr]:border-slate-200

  [&_sub]:text-xs
  [&_sub]:align-sub
  [&_sup]:text-xs
  [&_sup]:align-super

  [&_img]:h-auto
  [&_img]:max-w-full
  [&_img]:rounded-xl

  max-md:[&_table]:block
  max-md:[&_table]:overflow-x-auto
  max-md:[&_table]:max-w-full
`;

export default function RichTextContent({ html, className = '' }: { html: string; className?: string }) {
  return <div className={`${styles.content} ${richTextClasses} ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
