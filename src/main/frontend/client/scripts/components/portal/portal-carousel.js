import React, { Component } from 'react';

import { Carousel } from 'epm-ui';

import getUUID from '../../utilities/uuid';
import context from 'context';

/**
 *author: wangxiang
 *desc: 门户首页轮播
 *date:  2018/1/5
 */
class PortalCarousel extends Component {

  /**
   *
   * @returns {XML}
   */
  render() {
   // const array = portal_pics();

    return (
      <div>
        <Carousel showIndicators interval={ 4000 } height={ 440 } effect="slide">
          {/*{
            array ? array.map( ( item ) => {

              return (
                <Carousel.Panel key={ getUUID }>
                  <div style={ { backgroundImage: `url(${ item.pic })`, backgroundSize: '100% 100%', width: '100%', height: '100%' } }>
                    &nbsp;
                  </div>
                </Carousel.Panel>
              );
            } ) : null
          }*/}
          <Carousel.Panel key={ getUUID }>
            <div style={ {
              backgroundImage: `url(${ context.contextPath }/static/img/carousel_2.jpg)`,
              backgroundSize: '100% 100%',
              width: '100%',
              height: '100%' } }
            >
              &nbsp;
            </div>
          </Carousel.Panel>
          <Carousel.Panel key={ getUUID }>
            <div style={ {
              backgroundImage: `url(${ context.contextPath }/static/img/carousel_1.png)`,
              backgroundSize: '100% 100%',
              width: '100%',
              height: '100%' } }
            >
              &nbsp;
            </div>
          </Carousel.Panel>
        </Carousel>
      </div>
    );
  }
}

export { PortalCarousel };
export default PortalCarousel;
