import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Buffer polyfill script that runs before any other code
              (function() {
                if (typeof window !== 'undefined') {
                  // Import buffer polyfill
                  import('buffer').then(({ Buffer }) => {
                    window.Buffer = Buffer;
                    window.global = window;
                    
                    // Extend Buffer prototype
                    if (Buffer.prototype && !Buffer.prototype.writeUint32BE) {
                      Buffer.prototype.writeUint32BE = function(value, offset = 0) {
                        return this.writeUInt32BE(value, offset);
                      };
                    }
                  }).catch(console.error);
                }
              })();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
