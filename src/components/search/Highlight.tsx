import { type Hit as AlgoliaHit } from '@algolia/client-search'
import {
  getHighlightedParts,
  getPropertyByPath,
} from 'instantsearch.js/es/lib/utils'
import React, { Fragment } from 'react'
import { type StyleProp, StyleSheet, Text, type TextStyle } from 'react-native'

interface HighlightPartProps {
  children: React.ReactNode
  isHighlighted: boolean
  style: StyleProp<TextStyle>
}

const HighlightPart = ({ children, style }: HighlightPartProps) => {
  return <Text style={style}>{children}</Text>
}

interface HighlightProps<THit> {
  hit: THit
  attribute: keyof THit | string[]
  className?: string
  separator?: string
  highlightedStyle?: StyleProp<TextStyle>
  nonHighlightedStyle?: StyleProp<TextStyle>
}

export const Highlight = <THit extends AlgoliaHit<Record<string, unknown>>>({
  hit,
  attribute,
  separator = ', ',
  highlightedStyle = styles.highlighted,
  nonHighlightedStyle = styles.nonHighlighted,
}: HighlightProps<THit>): JSX.Element => {
  const { value: attributeValue = '' } =
    getPropertyByPath(hit._highlightResult, attribute as string) || {}
  const parts = getHighlightedParts(attributeValue)

  return (
    <>
      {parts.map((part, partIndex) => {
        if (Array.isArray(part)) {
          const isLastPart = partIndex === parts.length - 1

          return (
            <Fragment key={partIndex}>
              {part.map((subPart, subPartIndex) => (
                <HighlightPart
                  key={subPartIndex}
                  isHighlighted={subPart.isHighlighted}
                  style={
                    subPart.isHighlighted
                      ? highlightedStyle
                      : nonHighlightedStyle
                  }
                >
                  {subPart.value}
                </HighlightPart>
              ))}

              {!isLastPart && separator}
            </Fragment>
          )
        }

        return (
          <HighlightPart
            key={partIndex}
            isHighlighted={part.isHighlighted}
            style={part.isHighlighted ? highlightedStyle : nonHighlightedStyle}
          >
            {part.value}
          </HighlightPart>
        )
      })}
    </>
  )
}

const styles = StyleSheet.create({
  highlighted: {
    fontWeight: 'bold',
    backgroundColor: '#f5df4d',
    color: '#6f6106',
  },
  nonHighlighted: {
    fontWeight: 'normal',
    backgroundColor: 'transparent',
    color: 'black',
  },
})
