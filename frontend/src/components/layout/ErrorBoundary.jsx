import { Component } from 'react';
import PropTypes from 'prop-types';

// Catches render errors anywhere below it so a single broken page does not
// blank out the whole app. i18n isn't safe inside componentDidCatch, so the
// fallback uses neutral bilingual copy.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In production this is where you'd report to Sentry/etc.
    // eslint-disable-next-line no-console
    console.error('App error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
          <p className="text-6xl font-extrabold text-primary">:(</p>
          <h1 className="mt-4 text-xl font-bold">Xatolik yuz berdi / Произошла ошибка</h1>
          <p className="mt-2 max-w-sm text-muted">
            Sahifani yangilab ko'ring. / Попробуйте обновить страницу.
          </p>
          <button
            onClick={() => window.location.assign('/')}
            className="mt-6 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark"
          >
            Bosh sahifa / На главную
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = { children: PropTypes.node };
