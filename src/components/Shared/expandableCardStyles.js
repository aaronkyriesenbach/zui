export const expandableCardStyles = {
  card: {
    marginBottom: '2px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'background.paper',
    border: '1px solid',
    borderColor: 'border.main',
    borderRadius: '0.75rem',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%'
  },
  content: {
    textAlign: 'left',
    color: 'text.muted',
    width: '100%',
    boxSizing: 'border-box',
    padding: '1rem',
    backgroundColor: 'background.paper',
    '&:hover': {
      backgroundColor: 'background.paper'
    },
    '&:last-child': {
      paddingBottom: '1rem'
    }
  },
  values: {
    fontSize: '1rem',
    fontWeight: '400',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
    textAlign: 'right'
  },
  dropdownText: {
    color: 'text.link',
    paddingTop: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center'
  },
  dropdownButton: {
    color: 'text.link',
    paddingTop: '1rem',
    fontSize: '0.8125rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  dropdownContentBox: {
    boxSizing: 'border-box',
    color: 'text.muted',
    fontSize: '1rem',
    fontWeight: '400',
    padding: '0.75rem',
    backgroundColor: 'background.muted',
    borderRadius: '0.9rem',
    overflowWrap: 'break-word'
  },
  divider: {
    margin: '1rem 0'
  }
};
