import { css } from '@emotion/react';
import { useEffect, useRef } from 'react';
import { SendWindowSize } from '../../components/SendWindowSize';
import { EmbedTweetNotFound } from './EmbedTweetNotFound';

type CreateTweet = (id: string, ele: HTMLElement, option: any) => Promise<any>;

export interface EmbedTweetProps {
  url?: string;
}

const containerClassName = 'embed-tweet-container';
const fallbackLinkClassName = 'embed-tweet-link';
const twitterPattern = /https?:\/\/twitter.com\/(.*?)\/status\/(\d+)[/?]?/;

const View = ({ url }: EmbedTweetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const match = url?.match(twitterPattern);
  const tweetId = match?.[2] || null;

  useEffect(() => {
    const createTweet = (window as any).twttr?.widgets?.createTweet as
      | CreateTweet
      | undefined;

    if (!tweetId || !containerRef.current || !createTweet) return;

    const container = containerRef.current;
    const disableConversation = url?.includes('?conversation=none');

    createTweet(tweetId, container, {
      align: 'center',
      ...(disableConversation ? { conversation: 'none' } : {}),
    })
      .then(() => {
        container.querySelector(`.${fallbackLinkClassName}`)?.remove();
      })
      .catch((e) => {
        console.error(e);
      });
  }, [tweetId]);

  if (!tweetId) return <EmbedTweetNotFound />;

  return (
    <div
      ref={containerRef}
      className={containerClassName}
      css={css`
        .twitter-tweet {
          margin: 0 !important;
        }
      `}
    >
      <a href={url} className={fallbackLinkClassName} rel="nofollow">
        {url}
      </a>
    </div>
  );
};

export const EmbedTweet = (props: EmbedTweetProps) => {
  return (
    <SendWindowSize url={props.url || ''} className="embed-tweet">
      <View {...props} />
    </SendWindowSize>
  );
};
